const router = require('express').Router();
const { body } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const profileController = require('../controllers/profile');
const { verifyUser } = require('../middlewares/authenticate');

router.get('/', verifyUser, profileController.getMyProfile);

const auth = require('../middlewares/authenticate');

router.get('/products', auth.verifyUser, profileController.getUserProducts);
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
      .if(body('oldPassword').exists())
      .notEmpty()
      .withMessage('You have to enter new password!')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long!')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{0,}$/)
      .withMessage('Password must contain a number, uppercase and lowercase'),

    body('oldPassword')
      .if(body('password').exists())
      .notEmpty()
      .withMessage('You have to enter oldPassword!'),

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

    body('phoneNumber')
      .optional()
      .isLength({ min: 1 })
      .withMessage('School name cannot be empty!'),
    body('address')
      .optional()
      .isLength({ min: 1 })
      .withMessage('School name cannot be empty!'),
  ],
  profileController.updateProfile
);

module.exports = router;
