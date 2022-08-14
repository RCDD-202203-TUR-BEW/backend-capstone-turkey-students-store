const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

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

// check if requestedBuyers doesn't have buyerId already. product.requestedBuyers.find(i => i.toHexString() === buyerId.toHexString())
exports.requestProduct = async (req, res, next) => {
  const productId = req.params.id;
  const buyerId = req.user._id;
  const product = await Product.findOne({ _id: productId });
  // check if the product is not null
  if (product) {
    product.requestedBuyers.push(buyerId);
    await product.save();
    res.status(200).json({ success: true, data: product });
  }
  return res
    .status(400)
    .json({ success: false, data: { message: 'Invalid request!' } });
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found!', 404));
  }
  return res.status(200).json({ success: true, data: product });
};
