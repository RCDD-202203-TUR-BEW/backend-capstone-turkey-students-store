const router = require('express').Router();
const { body } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

const usersController = require('../controllers/profile');
const { verifyUser } = require('../middlewares/authenticate');

router.get('/', verifyUser, usersController.getMyProfile);
router.patch(
  '/',
  verifyUser,
  [
    body('email')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Email cannot be empty!')
      .isEmail()
      .withMessage('Invalid email format!'),
    body('password')
      .optional()
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long!')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{0,}$/)
      .withMessage('Password must contain a number, uppercase and lowercase')
      .isLength({ min: 1 })
      .withMessage('Password cannot be empty!'),
    body('firstName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('First name cannot be empty!'),
    body('lastName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Last name cannot be empty!'),
    body('schoolName')
      .optional()
      .isLength({ min: 1 })
      .withMessage('School name cannot be empty!'),
  ],
  usersController.updateProfile
);
module.exports = router;
