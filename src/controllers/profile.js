const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');
const Product = require('../models/product');

exports.getMyProfile = async (req, res) => {
  res.json({ success: true, data: req.user });

  // This is an example of a successful response
};
exports.updateProfile = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  let user = await User.findById(req.user._id);
  if ('email' in req.body) {
    const userexist = await User.findOne({ email: req.body.email });
    if (userexist) {
      return next(new ErrorResponse('Email already exists!', 400));
    }
  }
  if ('password' in req.body) {
    if (!(await bcrypt.compare(req.body.oldPassword, user.password))) {
      return next(
        new ErrorResponse(
          'Your old password is not correct please enter again!',
          401
        )
      );
    }

    req.body.password = await bcrypt.hash(req.body.password, 10);
  }

  user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        schoolName: req.body.schoolName,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
      },
    },
    { new: true }
  );
  return res.status(200).json({ success: true, data: user });
};
exports.getUserProducts = async (req, res, next) => {
  const products = await Product.find({ seller: req.user._id });
  return res.status(200).json({ success: true, data: products });
};
