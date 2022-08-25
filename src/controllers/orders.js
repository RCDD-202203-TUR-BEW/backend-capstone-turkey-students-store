const Order = require('../models/order');
const ErrorResponse = require('../utils/errorResponse');

exports.getMyOrders = async (req, res, next) => {
  const myOrders = await Order.find({ buyer: req.user._id })
    .populate('product', '-requestedBuyers')
    .populate({ options: { lean: true }, select: 'address', path: 'buyer' });
  return res.status(200).json({ success: true, data: myOrders });
};

exports.getOrder = async (req, res, next) => {
  const order = await Order.findOne({
    _id: req.params.id,
    buyer: req.user._id,
  });
  if (!order) {
    return next(new ErrorResponse('Order not found!', 404));
  }

  return res.status(200).json({ success: true, data: order });
};
