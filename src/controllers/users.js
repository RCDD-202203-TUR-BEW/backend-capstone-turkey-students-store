const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

/* This is an example of a router controller */
exports.getUser = async (req, res, next) => {
  const user = await User.find();
  if (!user) {
    // This is an example of an error
    return next(new ErrorResponse('User not found', 404));
  }

  // This is an example of a successful response
  return res.json({ success: true, data: user });
};
