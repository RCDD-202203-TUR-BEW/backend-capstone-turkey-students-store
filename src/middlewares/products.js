const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

exports.verifyOwner = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found!', 404));
  }

  if (req.user.id !== product.seller) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access or modify this product details!`,
        401
      )
    );
  }
  next();
};
