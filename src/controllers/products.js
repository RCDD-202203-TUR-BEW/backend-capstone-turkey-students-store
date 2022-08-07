const Product = require('../models/product');
const ErrorResponse = require('../utils/errorResponse');

// eslint-disable-next-line consistent-return
async function removeProduct(req, res, next) {
  const productId = req.params.id;
  if (!productId) {
    next(new ErrorResponse('Product ID is required', 400));
  }
  // const product = await Product.findById(productId);
  // if (!product) {
  //   next(new ErrorResponse('Product not found', 404));
  // }
  try {
    await Product.deleteOne({ _id: productId });
    return res
      .status(200)
      .json({ success: true, data: 'Product deleted successfully.' });
  } catch (error) {
    next(new ErrorResponse('Product not found', 404));
  }
}
module.exports = { removeProduct };
