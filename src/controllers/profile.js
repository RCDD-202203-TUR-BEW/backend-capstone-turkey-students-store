const Product = require('../models/product');
const ErrorResponse = require('../utils/errorResponse');

exports.getMyProductsForSale = async (req, res, next) => {
  const myProductsForSale = await Product.find({ seller: req.user._id });
  if (!myProductsForSale) {
    return next(new ErrorResponse('Unable to locate element!', 404));
  }
  return res.status(200).json({ success: true, data: myProductsForSale });
};
