const Order = require('../models/order');

exports.getMyOrders = async (req, res, next) => {
  const myOrders = await Order.find({ buyer: req.user._id });
  return res.status(200).json({ success: true, data: myOrders });
};

// DELETE AFTER TESTING
exports.giveOrder = async (req, res, next) => {
  const order = await Order.create({
    buyer: req.user._id,
    totalPrice: 100,
    orderItems: [],
    notes: 'My books order',
  });
  return res.status(201).json({ success: true, data: order });
};
