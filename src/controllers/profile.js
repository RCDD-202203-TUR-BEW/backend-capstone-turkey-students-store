/* eslint-disable no-unused-vars */
const Product = require('../models/product');

const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

exports.getMyProfile = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

exports.getUserProducts = async (req, res, next) => {
  const products = await Product.find({ seller: req.user._id });
  return res.status(200).json({ success: true, data: products });
};
