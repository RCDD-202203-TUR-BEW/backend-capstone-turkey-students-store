const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

exports.getAllProducts = async (req, res, next) => {
  const allProducts = await Product.find();
  return res.status(200).json({ success: true, data: allProducts });
};
