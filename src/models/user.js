const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  schoolName: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: Number,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  provider: {
    type: String,
  },

  providerId: {
    type: String,
    required: false,
  },

  profilePicture: {
    type: String,
    required: false,
  },
});
module.exports = mongoose.model('User', userSchema);
