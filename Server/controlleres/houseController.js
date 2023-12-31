const House = require("../models/houseModel");
const { AppError } = require("../utils/appError");
const multer = require("multer");
const sharp = require("sharp");
const ApiFeatures = require("../utils/apiFeatures");
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Not an image! Please upload only images.", 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadHouseImages = upload.array("images", 20);

exports.resizeHouseImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) return next();

  req.body.images = [];

  req.files.forEach(async (file) => {
    const filename = `house-${Date.now()}${Math.random() * 1000}.jpeg`;

    sharp(file.buffer)
      .resize(750, 500)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`public/img/houses/${filename}`);

    req.body.images.push(filename);
  });

  next();
};

exports.getAllHouses = async (req, res, next) => {
  try {
    const features = new ApiFeatures(House.find(), req.query)
      .filter()
      // .sorting()
      .feildsSelect();
    // .pageination();
    console.log(req.query);
    const houses = await features.query;

    res.status(200).json({
      status: "success",
      houseCount: houses.length,
      data: {
        houses,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.createHouse = async (req, res, next) => {
  try {
    // const images = req.files.map((file) => file.filename);
    // req.body.images = images;
    const newHouse = await House.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        house: newHouse,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.getHouse = async (req, res, next) => {
  try {
    const house = await House.findById(req.params.id).populate("reviews");

    const unavailableDates = await house.calculateUnavailableDates();
    house.unavailableDates = unavailableDates;

    if (!house) {
      return next(
        new AppError(`There is no house with the id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "Success",
      data: {
        house,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.updateHouse = async (req, res, next) => {
  try {
    const house = await House.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!house) {
      return next(
        new AppError(`There is no house with the id ${req.params.id}`, 404)
      );
    }

    res.status(200).json({
      status: "Success",
      data: {
        house,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.deleteHouse = async (req, res, next) => {
  try {
    const house = await House.findByIdAndDelete(req.params.id);

    if (!house) {
      return next(
        new AppError(`There is no house with the id ${req.params.id}`, 404)
      );
    }

    res.status(204).json({
      status: "success",
      data: {
        deletedHouse: house,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.getHousesByCategory = async (req, res, next) => {
  try {
    const houses = await House.find({ category: req.params.Id });

    res.status(200).json({
      status: "success",
      data: {
        houses,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

exports.searchHousesByRegion = async (req, res, next) => {
  try {
    const { region } = req.query;

    const query = {};

    if (region) {
      query.region = region;
    }

    const houses = await House.find(query).populate("category");

    res.status(200).json({
      status: "success",
      houseCount: houses.length,
      data: {
        houses,
      },
    });
  } catch (error) {
    next(new AppError(error.message, 500));
  }
};
