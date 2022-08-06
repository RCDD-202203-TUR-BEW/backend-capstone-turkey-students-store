const router = require('express').Router();
const { body } = require('express-validator');

const authController = require('../controllers/auth');

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
