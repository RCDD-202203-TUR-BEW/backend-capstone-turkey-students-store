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
exports.updateProduct = async (req, res) => {
  // check for validation errors first
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        coverImage: req.body.coverImage,
        images: req.body.images,
        type: req.body.type,
        location: req.body.location,
        status: req.body.status,
        condition: req.body.condition,
        seller: req.body.seller,
      },
    },
    { new: true }
  );
  return res.status(200).json({ success: true, data: product });
};
