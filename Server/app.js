const express = require("express");
const { errorHandler, AppError } = require("./utils/appError");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");

const houseRoute = require("./routes/houseRoute");
const userRoute = require("./routes/userRoute");
const reservationRoute = require("./routes/reservationRoute");
const reviewRoute = require("./routes/reviewRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const categoryRoute = require("./routes/categoryRoute");
const statsRoute = require("./routes/statsRoute");

const app = express();
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use(express.static("public"));
app.use(helmet());
app.use(express.json());
app.use("/", limiter);
app.use(cors());
app.use(mongoSanitize());
app.use(xss());

app.use("/houses", houseRoute);
app.use("/users", userRoute);
app.use("/reservations", reservationRoute);
app.use("/reviews", reviewRoute);
app.use("/wishlists", wishlistRoute);
app.use("/categories", categoryRoute);
app.use("/stats", statsRoute);

app.all("*", (req, res, next) => {
  const err = new AppError(`There is no route for this ${req.originalUrl}`);
  next(err);
});

app.use(errorHandler);

module.exports = app;
