/* eslint-disable no-unused-vars */
const Product = require('../models/product');
// eslint-disable-next-line no-unused-vars
const ErrorResponse = require('../utils/errorResponse');

exports.getUserProducts = async (req, res, next) => {
  const products = await Product.find({ seller: req.user._id });
  return res.status(200).json({ success: true, data: products });
};
