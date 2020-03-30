const ApiError = require('../utils/ApiErrors');

const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ApiError(message, 400);
};

const handleDuplicateErrorDB = err => {
  console.log(err);
  const message = ` Duplicate field value not allowed for ${
    Object.keys(err.keyValue)[0]
  }. Please use another value`;
  return new ApiError(message, 400);
};

const hanldeValidationError = err => {
  const message = Object.values(err.errors)
    .map(el => el.message)
    .join(`. || `);

  return new ApiError(message, 400);
};

const hanldeJsonWebTokenError = () => {
  const message = 'Invalid token, please login again!';
  return new ApiError(message, 400);
};

const hanldeTokenExpiredError = err => {
  const message = `Your token has been expired at: ${err.expiredAt.toLocaleTimeString(
    'en-US'
  )}. Please login again!`;
  return new ApiError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    errorStack: err.stack
  });
};

const sendErrorProd = (err, res) => {
  //
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error('Error: 💥  ▶️ ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = err;
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateErrorDB(error);
    if (error.name === 'ValidationError') error = hanldeValidationError(error);
    if (error.name === 'JsonWebTokenError')
      error = hanldeJsonWebTokenError(error);
    if (error.name === 'TokenExpiredError')
      error = hanldeTokenExpiredError(error);

    sendErrorProd(error, res);
  }
};
