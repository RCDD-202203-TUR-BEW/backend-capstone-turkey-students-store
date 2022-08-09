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
  const productObject = { ...req.body };
  if (!productObject.images || productObject.images.length === 0) {
    delete productObject.images;
  }
  // set seller as this user; get user's id from token -> req.user
  productObject.seller = req.user._id;
  const product = await Product.create(productObject);
  return res.status(201).json({ success: true, data: product });
};
