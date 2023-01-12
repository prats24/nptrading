const { CustomError, createCustomError } = require('./customError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ status: 'error', error: err.message });
  } else {
    res.status(500).json({ status: 'error', error: err.message });
  }
};

module.exports = errorHandler;