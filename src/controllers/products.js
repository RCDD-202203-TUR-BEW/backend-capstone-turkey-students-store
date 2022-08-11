const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

// eslint-disable-next-line consistent-return
exports.removeProduct = async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) {
    next(new ErrorResponse('Product ID is required', 400));
  }
  // const product = await Product.findById(productId);
  // if (!product) {
  //   next(new ErrorResponse('Product not found', 404));
  // }
  try {
    await Product.deleteOne({ _id: productId });
    return res
      .status(200)
      .json({ success: true, data: 'Product deleted successfully.' });
  } catch (error) {
    next(new ErrorResponse('Product not found', 404));
  }
};

exports.createProduct = async (req, res, next) => {
  // check for validation errors first
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  // set seller as this user; get user's id from token -> req.user
  req.body.seller = req.user._id;
  const product = await Product.create(req.body);
  return res.status(201).json({ success: true, data: product });
};
