const router = require('express').Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth');

router.post(
  '/signup',
  [
    body('emailAddress')
      .not()
      .isEmpty()
      .withMessage('Email should not be empty!')
      .isEmail()
      .withMessage('Invalid email format!'),
    body('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long!')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{0,}$/)
      .withMessage('Password must contain a number, uppercase and lowercase')
      .custom((val, { req }) => val === req.body.confirmPassword)
      .withMessage('Passwords do not match!')
      .not()
      .isEmpty()
      .withMessage('Password should not be empty!'),
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
