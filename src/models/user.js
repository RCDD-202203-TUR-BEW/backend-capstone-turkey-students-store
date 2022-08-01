const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// virtual field; full name
userSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});
// .set(function (v) {
//   const firstName = v.substring(0, v.indexOf(' '));
//   const lastName = v.substring(v.indexOf(' ') + 1);
//   this.set({ firstName, lastName });
// });

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
