const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

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

  let hashedPassword;

  if (req.body.password) {
    hashedPassword = await bcrypt.hash(req.body.password, 10);
  }
  const userexist = await User.findOne({ email: req.body.email });
  if (userexist) {
    return next(new ErrorResponse('Email already exists!', 400));
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        schoolName: req.body.schoolName,
        password: hashedPassword,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        provider: req.body.provider,
        providerId: req.body.providerId,
      },
    },
    { new: true }
  );

  return res.status(200).json({ success: true, data: user });
};
