const Order = require('../models/order');
const Product = require('../models/product');

exports.getMyOrders = async (req, res, next) => {
  const myOrders = await Order.find({ buyer: req.user._id })
    .populate('orderItems.item', 'title category price location')
    .populate({ options: { lean: true }, select: 'address', path: 'buyer' });
  return res.status(200).json({ success: true, data: myOrders });
};

// DELETE AFTER TESTING
exports.giveOrder = async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id });

  const order = await Order.create({
    buyer: req.user._id,
    totalPrice: product.price,
    orderItems: [{ item: req.params.id, quantity: 1 }],
  });

  return res.status(201).json({ success: true, data: order });
};
