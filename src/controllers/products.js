const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

exports.getAllProducts = async (req, res, next) => {
  const allProducts = await Product.find();
  return res.status(200).json({ success: true, data: allProducts });
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

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found!', 404));
  }
  return res.status(200).json({ success: true, data: product });
};
