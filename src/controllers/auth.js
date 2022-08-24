const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

const setTokenCookie = (userId, res) => {
  const payload = {
    _id: userId,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14 days',
  });

  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
    // secure: process.env.NODE_ENV === 'production',
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  });
};

exports.sendFacebookJwt = (req, res) => {
  setTokenCookie(req.user._id, res);

  return res.status(200).json({ success: true, data: req.user });
};

exports.signup = async (req, res, next) => {
  // check for validation errors first
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }
  // no validation errors, extract fields
  const { firstName, lastName, email, schoolName, password } = req.body;

  // Check if email is unique
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorResponse('Email already exists!', 400));
  }

  // no such user exists, create new one
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    firstName,
    lastName,
    email,
    schoolName,
    password: hashedPassword,
  });

  setTokenCookie(user._id, res);

  return res.status(201).json({ success: true, data: user });
};

exports.signin = async (req, res, next) => {
  // check for validation errors first
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  const { email, password } = req.body;
  // check if user with given email exists
  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('Invalid email or password!', 401));
  }

  // user exists, check if given password is correct
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return next(new ErrorResponse('Invalid email or password!', 401));
  }

  setTokenCookie(user._id, res);

  return res.status(200).json({ success: true, data: user });
};

exports.googleAuthJWT = (req, res) => {
  setTokenCookie(req.user._id, res);

  return res.status(200).json({ success: true, data: req.user });
};

exports.twitterAuthJWT = (req, res) => {
  setTokenCookie(req.user._id, res);

  return res.status(200).json({ success: true, data: req.user });
};
