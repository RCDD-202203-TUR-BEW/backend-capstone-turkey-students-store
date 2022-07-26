const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    amount: Number,
    fullName: String,
    email: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
