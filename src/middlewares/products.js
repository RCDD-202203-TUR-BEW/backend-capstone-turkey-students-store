const ErrorResponse = require('../utils/errorResponse');

exports.verifyOwner = (req, res, next) => {
  if (req.user.id !== req.product.seller.toString()) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access or modify this product details!`,
        401
      )
    );
  }
  next();
};
