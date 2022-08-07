const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

exports.getAllProfiles = async (req, res, next) => {
  const profiles = await User.find();
  if (!profiles) {
    return next(new ErrorResponse('No profiles found', 404));
  }
  return res.status(200).json({ success: true, data: profiles });
};
