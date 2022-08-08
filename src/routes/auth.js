const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');
const { body } = require('express-validator');

const authController = require('../controllers/auth');
const { verifyUser } = require('../middlewares/authenticate');

const router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    // Successful authentication, redirect home.
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
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 3600 * 24 * 14,
    });

    res.json({ success: true, data: req.user });
  }
);

router.get('/profile', verifyUser, (req, res) => {
  res.json({ success: true, data: req.user });
});

/* TODO: add documentation for logout */
router.post('/logout', verifyUser, (req, res) => {
  res.clearCookie('token');
  res.status(205).json({ success: true });
});

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
