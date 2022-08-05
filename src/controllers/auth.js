const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

exports.signup = async (req, res, next) => {
  // check for validation errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgArray = errors.errors.map((element) => element.msg);
    return next(new ErrorResponse(errorMsgArray, 400));
  }
  // no validation errors, extract fields
  const { name, surname, emailAddress, schoolName, password, confirmPassword } =
    req.body;

  // Check if email is unique
  let user = await User.findOne({ email: emailAddress });
  if (user) {
    return next(new ErrorResponse('Email already exists!', 400));
  }

  // Check password equality
  if (password !== confirmPassword) {
    return next(new ErrorResponse('Passwords do not match!', 400));
  }

  // no such user exists, create new one
  const hashedPassword = await bcrypt.hash(password, 10);

  user = await User.create({
    firstName: name,
    lastName: surname,
    email: emailAddress,
    schoolName,
    password: hashedPassword,
  });

  // delete user's password before returning
  user = user.toObject();
  delete user.password;

  return res.status(201).json({ success: true, data: user });
};

exports.signin = async (req, res, next) => {
  // check for validation errors first
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgArray = errors.errors.map((element) => element.msg);
    return next(new ErrorResponse(errorMsgArray, 400));
  }

  const { email, password } = req.body;
  // check if user with given email exists
  let user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('Invalid email or password!', 401));
  }

  // user exists, check if given password is correct
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return next(new ErrorResponse('Invalid email or password!', 401));
  }

  // login successful, create jwt
  const payload = {
    userId: user._id,
    name: user.fullName,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.SECRET, {
    expiresIn: '14 days',
  });

  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  });

  // delete user's password before returning
  user = user.toObject();
  delete user.password;

  return res.status(200).json({ success: true, data: user });
};
