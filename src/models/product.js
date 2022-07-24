const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      maxLength: 150,
      required: [true, 'Title cannot be empty!'],
    },
    description: {
      type: String,
      required: [true, 'Description cannot be empty!'],
    },
    price: {
      type: Number,
      required: [true, 'Price cannot be empty!'],
    },
    category: {
      type: String,
      required: [true, 'Please type in a category!'],
    },
    coverImage: {
      type: String,
      required: [true, 'Cover image cannot be empty!'],
    },
    images: {
      type: [String],
    },
    type: {
      type: [String],
      enum: {
        values: ['Product', 'Service'],
        message: '{VALUE} is not supported!',
      },
      required: [true, 'Please select the type of the product!'],
    },
    location: {
      type: String,
      required: [true, 'Location cannot be empty!'],
      maxLength: 50,
    },
    status: {
      type: [String],
      enum: {
        values: ['Active', 'Sold'],
        message: '{VALUE} is not supported!',
      },
      required: [true, 'Please select the status of the product!'],
      default: 'Active',
    },
    condition: {
      type: [String],
      enum: {
        values: ['New', 'Used'],
        message: '{VALUE} is not supported!',
      },
      required: [true, 'Please select the condition of the product!'],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    requestedBuyers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
