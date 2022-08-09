const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

exports.getAllProducts = async (req, res, next) => {
  const allProducts = await Product.find();
  return res.status(200).json({ success: true, data: allProducts });
};

// delete after testing
exports.createProduct = async (req, res, next) => {
  const productObject = { ...req.body };
  if (!productObject.images || productObject.images.length === 0) {
    delete productObject.images;
  }
  // set seller as this user; get user's id from token -> req.user
  // productObject.seller = req.user._id;
  const product = await Product.create(productObject);
  return res.status(201).json({ success: true, data: product });
};
