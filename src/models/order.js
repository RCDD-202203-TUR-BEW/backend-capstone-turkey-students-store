const mongoose = require('mongoose');
// order model doesnt have seller!
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
    totalPrice: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
      default: 'pending',
      enum: ['pending', 'completed', 'cancelled'],
    },
    orderItems: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    notes: {
      type: String,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model('Order', orderSchema);
