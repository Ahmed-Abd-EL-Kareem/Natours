const AppError = require("../utils/appError");

const handelCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handelDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value} already exists`;
  return new AppError(message, 400);
};
const handelValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};
const handelJWTError = () =>
  new AppError("Invalid token. Please log in again!", 401);

const handelJWTExpiredError = () =>
  new AppError("Your token has expired. Please log in again!", 401);
const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  console.error("ERROR 💥💥💥: ", err);

  // Rendered website
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong",
    msg: err.message
  });
};
const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Programming or other unknown error: don't leak sensitive information
      // 1) Log error
      console.error("ERROR 💥💥💥: ", err);
      // 2) Send generic message to client
      res.status(500).json({
        status: "error",
        message: "Something went wrong, please try again later."
      });
    }
  }
  // Rendered website
  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Something went wrong",
      msg: err.message
    });
  }
  // Programming or other unknown error: don't leak sensitive information
  // 1) Log error
  console.error("ERROR 💥💥💥: ", err);
  // 2) Send generic message to client
  return res.status(500).render("error", {
    title: "Something went wrong",
    msg: "Please try again later."
  });

  // Operational, trusted error: send message to client
};

module.exports = (err, req, res, next) => {
  // console.error(err.stack);
  // console.log("G ERROR");
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Error";
  if (process.env.NODE_ENV.trim() === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV.trim() === "production") {
    // console.log("P ERROR");
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    if (error.name === "CastError") error = handelCastErrorDB(error);
    if (error.code === 11000) error = handelDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handelValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handelJWTError();
    if (error.name === "TokenExpiredError") error = handelJWTExpiredError();
    sendErrorProd(error, req, res);
  }
};
