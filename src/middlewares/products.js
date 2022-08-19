const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

exports.verifyOwner = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(
      new ErrorResponse(`Product with id ${req.params.id} not found!`, 404)
    );
  }
  const productSeller = product.seller.toString();
  if (req.user.id !== productSeller) {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to access or modify this product details!`,
        401
      )
    );
  }
  next();
};
