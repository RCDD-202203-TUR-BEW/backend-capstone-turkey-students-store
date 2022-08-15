const Order = require('../models/order');

exports.getMyOrders = async (req, res, next) => {
  const myOrders = await Order.find({ buyer: req.user._id });
  return res.status(200).json({ success: true, data: myOrders });
};
