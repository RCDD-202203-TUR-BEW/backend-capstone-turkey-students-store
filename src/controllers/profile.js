const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

exports.getMyProfile = async (req, res) => {
  // console.log('REQ USER:', req.user);
  console.log(req.user);
  console.log(req.user.constructor);
  res.status(200).json({ success: true, data: req.user });
};
