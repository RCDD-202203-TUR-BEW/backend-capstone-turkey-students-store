const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

exports.getMyProfile = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};
