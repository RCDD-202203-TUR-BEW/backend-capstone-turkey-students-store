const router = require('express').Router();
const passport = require('passport');

const jwt = require('jsonwebtoken');
const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const { verifyUser } = require('../middlewares/authenticate');
const { googleAuthJWT } = require('../controllers/auth');

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
  }),
  googleAuthJWT
);

router.get('/profile', verifyUser, (req, res) => {
  res.json({ success: true, data: req.user });
});

/* TODO: add documentation for logout */
router.post('/logout', verifyUser, (req, res) => {
  res.clearCookie('token');
  res.status(205).json({ success: true });
});

// const jwt = require('jsonwebtoken');

// const User = require('../models/user');

router.get('/twitter', passport.authenticate('twitter'));
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  // eslint-disable-next-line prefer-arrow-callback
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);

router.post(
  '/signup',
  [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email cannot be empty!')
      .isEmail()
      .withMessage('Invalid email format!'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long!')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{0,}$/)
      .withMessage('Password must contain a number, uppercase and lowercase')
      .not()
      .isEmpty()
      .withMessage('Password cannot be empty!'),
    body('firstName')
      .not()
      .isEmpty()
      .withMessage('First name cannot be empty!'),
    body('lastName').not().isEmpty().withMessage('Last name cannot be empty!'),
    body('schoolName')
      .not()
      .isEmpty()
      .withMessage('School name cannot be empty!'),
  ],
  authController.signup
);

router.post(
  '/signin',
  [
    body('email')
      .not()
      .isEmpty()
      .withMessage('Email should not be empty!')
      .isEmail()
      .withMessage('Invalid email format!'),
    body('password')
      .not()
      .isEmpty()
      .withMessage('Password should not be empty!'),
  ],
  authController.signin
);

module.exports = router;
