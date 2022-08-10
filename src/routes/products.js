const router = require('express').Router();
const { body } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const auth = require('../middlewares/authenticate');
const productsController = require('../controllers/products');

router.patch(
  '/:id',
  auth.verifyUser,
  [
    body('title')
      .optional()
      .isLength({ min: 1, max: 150 })
      .withMessage('Length should be between 1-150 characters!'),

    body('description')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Description should not be empty!'),
    body('price')
      .optional()
      .isLength({ min: 1 })
      .withMessage('price should not be empty!'),
    body('category')
      .optional()
      .isLength({ min: 1 })
      .withMessage('category should not be empty!'),

    body('coverImage')
      .not()
      .isEmpty()
      .withMessage('Cover image cannot be empty!'),
    body('images')
      .optional()
      .isArray({ max: 3 })
      .withMessage('You cannot add more than three additional images!'),
    body('location')
      .not()
      .isEmpty()
      .withMessage('Location cannot be empty!')
      .isLength({ max: 50 })
      .withMessage('Location cannot be more than 50 characters!'),
    body('condition')
      .not()
      .isEmpty()
      .withMessage('Please select the condition of the product!'),
  ],
  productsController.updateProduct
);

module.exports = router;
