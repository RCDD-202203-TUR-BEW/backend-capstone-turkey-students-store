const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

exports.createProduct = async (req, res, next) => {
  // console.log('REQ:', req.user);
  // console.log('REQ BODY:', req.body);
  // GET SELLER ID FROM TOKEN and AUTHENTICATION
  const productObject = { ...req.body };
  if (!productObject.images || productObject.images.length === 0) {
    delete productObject.images;
  }
  // productObject.seller = req.user._id;
  const product = await Product.create(productObject);
  return res.status(201).json({ success: true, data: product });
};
