// /* eslint-disable  */
const path = require("path");
const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouter = require("./Routes/tourRoutes");
const userRouter = require("./Routes/userRoutes");
const reviewRouter = require("./Routes/reviewRoutes");
const viewRouter = require("./Routes/viewRoutes");
const bookingRouter = require("./Routes/bookingRoutes");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // Set the views directory
// ! 1) GLOBAL MIDDLEWARES
// Serving static files from the public directory (usually public/images, public/js, public/css)
app.use(express.static(path.join(__dirname, "public")));

// Set Security HTTP headers
app.use(helmet());
// Development logging
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV.trim() === "development") {
  app.use(morgan("dev"));
}
// Limit requests from same API
const limiter = rateLimit({
  max: 100, // limit each IP to 100 requests per windowMs
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!"
});

app.use("/api", limiter);

app.use(cookieParser()); // Cookie parser, reading cookies from req.cookies
// Body parser, reading data from body into req.body
app.use(express.json({ limit: "100kb" }));
// For parsing application/json
app.use(express.urlencoded({ extended: true, limit: "100kb" })); // For parsing application/x-www-form-urlencoded

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution attacks
app.use(
  hpp({
    whitelist: [
      "duration",
      "ratingsQuantity",
      "ratingAverage",
      "difficulty",
      "price",
      "maxGroupSize"
    ]
  })
);

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//! 2) ROUTES HANDLING

//! 3) ROUTES

app.use("/", viewRouter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/bookings", bookingRouter);
app.get("/.well-known/appspecific/com.chrome.devtools.json", (req, res) => {
  res.status(404).end();
});
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);
module.exports = app;
//! 4) SERVER
