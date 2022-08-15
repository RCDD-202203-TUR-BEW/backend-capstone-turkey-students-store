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
exports.updateProduct = async (req, res, next) => {
  // check for validation errors first
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }
  // eslint-disable-next-line no-cond-assign, no-undef
  const myProduct = await Product.findById(req.params.id);
  if (!myProduct) {
    return next(new ErrorResponse('No such product exists!', 404));
  }

  if (myProduct.seller.toString() !== req.user._id.toString()) {
    return next(new ErrorResponse('Unauthorized!', 403));
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );
  return res.status(200).json({ success: true, data: product });
};
