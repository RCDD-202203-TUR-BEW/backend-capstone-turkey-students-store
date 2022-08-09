const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/user');

exports.sendFacebookJwt = (req, res) => {
  if (req.user) {
    //     const token = auth.getToken({ _id: req.user._id });
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET_KEY, {
      expiresIn: '60s',
    });
    res.cookie('token', token, { secure: true, httpOnly: true });
    return res.status(200).send(req.user);
  }

  return res.status(401).send('Unauthorized');
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

  // login successful, create jwt
  const payload = {
    _id: user._id,
  };
  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14 days',
  });

  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  });

  return res.status(200).json({ success: true, data: user });
};

exports.googleAuthJWT = (req, res) => {
  const { name, firstName, lastName, email, providerId, profilePicture } =
    req.user;

  const payload = {
    name,
    firstName,
    lastName,
    email,
    providerId,
    avatar: profilePicture,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: '14 days',
  });

  res.cookie('token', token, {
    httpOnly: true,
    signed: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
  });

  return res.status(200).json({ success: true, data: req.user });
};
