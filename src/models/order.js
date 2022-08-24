const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    orderDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Order', orderSchema);
