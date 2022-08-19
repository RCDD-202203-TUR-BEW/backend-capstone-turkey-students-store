const router = require('express').Router();
const passport = require('passport');
const { body } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const authController = require('../controllers/auth');
const { verifyUser } = require('../middlewares/authenticate');
const { twitterAuthJWT } = require('../controllers/auth');

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    session: false,
  }),
  authController.sendFacebookJwt
);

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
  authController.googleAuthJWT
);

router.get('/profile', verifyUser, (req, res) => {
  res.json({ success: true, data: req.user });
});

/* TODO: add documentation for logout */
router.post('/logout', verifyUser, (req, res) => {
  res.clearCookie('token');
  res.status(205).json({ success: true });
});

router.get(
  '/twitter',
  passport.authenticate('twitter', { scope: ['profile', 'email', 'openid'] })
);
router.get(
  '/twitter/callback',
  passport.authenticate('twitter', { session: false }),
  twitterAuthJWT
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
