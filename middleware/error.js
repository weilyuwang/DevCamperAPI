const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  // every enumerable property inside of err is copied into error
  let error = { ...err };

  // the err.message property is not always enumerable,
  // so we need to force it to copy with the line:
  error.message = err.message;

  // Log to console for dev
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = `Resource not found with`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if (err.code == 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
