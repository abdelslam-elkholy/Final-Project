const User = require("./../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { AppError } = require("./../utils/appError");

const createToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWT_STRING, {
    expiresIn: process.env.JWT_EXPIRE,
  });
  return token;
};

const sendToken = (user, statusCode, res) => {
  const token = createToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: false,
  };

  res.cookie("token", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signUp = async (req, res, next) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
    });

    sendToken(user, 201, res);
  } catch (err) {
    next(new AppError(err.message, 400));
  }
};

exports.signIn = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("You must Provide Email and password", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.validatePassword(password))) {
      return next(new AppError("Invalid Email Or Password", 401));
    }

    sendToken(user, 200, res);
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};
// exports.forgotPassword = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });

//     if (!user) {
//       return next(new AppError("there is no user with this email", 404));
//     }

//     const resetToken = user.createPasswordResetToken();

//     await user.save({ validateBeforeSave: false });
//   } catch (error) {
//     return next(new AppError(error.message, 500));
//   }
// };

exports.protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return next(new AppError("you are not logged in", 401));

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_STRING);
    const existUser = await User.findById(decoded.id);

    if (!existUser) {
      return next(new AppError("the user isnt exist anymore", 401));
    }

    if (existUser.checkChangedPasswordTime(decoded.iat)) {
      return next(new AppError("session ended please login again ", 401));
    }

    req.user = existUser;

    next();
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You dont have permission", 403));

    next();
  };
};

exports.accessControl = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  if (req.user._id.toString() === req.params.id) {
    return next();
  }

  return next(new AppError("you dont have permission", 403));
};

// exports.logout = (req, res, next) => {
//   res.cookie("token", "loggedout", {
//     expires: new Date(Date.now() + 10 * 1000),
//     httpOnly: true,
//   });

//   res.status(200).json({
//     status: "success",
//   });
// };
