const errorHandlerMiddleware = (err, req, res, next) => {
  console.error(err.stack);  // Logs the stack trace for debugging

  // Handle specific errors for better responses
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation Error',
      message: err.message,
      details: err.errors,
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid Data',
      message: `Invalid value for field ${err.path}`,
    });
  }

  if (err.status === 404) {
    return res.status(404).json({
      error: 'Not Found',
      message: err.message || 'Resource not found',
    });
  }

  // Handle custom errors
  if (err.custom && err.statusCode) {
    return res.status(err.statusCode).json({
      error: err.custom,
      message: err.message,
    });
  }

  // General server errors (default case)
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandlerMiddleware;
