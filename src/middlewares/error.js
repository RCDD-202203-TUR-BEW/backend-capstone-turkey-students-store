const errorHandler = (err, req, res, next) => {
  console.log('here!!!!');

  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
};

module.exports = errorHandler;
