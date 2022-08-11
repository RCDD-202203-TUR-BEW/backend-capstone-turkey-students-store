const router = require('express').Router();
const { body } = require('express-validator');
const productsController = require('../controllers/products');
const auth = require('../middlewares/authenticate');

router.post(
  '/',
  auth.verifyUser,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Product name cannot be empty!')
      .isLength({ max: 150 })
      .withMessage('Product name cannot be more than 150 characters!'),
    body('description')
      .not()
      .isEmpty()
      .withMessage('Description cannot be empty!'),
    body('price').not().isEmpty().withMessage('Price cannot be empty!'),
    body('category').not().isEmpty().withMessage('Please type in a category!'),
    body('coverImage')
      .not()
      .isEmpty()
      .withMessage('Cover image cannot be empty!'),
    body('images')
      .optional()
      .isArray({ max: 3 })
      .withMessage('You cannot add more than three additional images!'),
    body('type')
      .not()
      .isEmpty()
      .withMessage('Please select the type of the product!'),
    body('location')
      .not()
      .isEmpty()
      .withMessage('Location cannot be empty!')
      .isLength({ max: 50 })
      .withMessage('Location cannot be more than 50 characters!'),
  ],
  productsController.createProduct
);
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
      .optional()
      .isLength({ min: 1 })
      .withMessage('Cover image cannot be empty!'),
    body('images')
      .optional()
      .isArray({ max: 3 })
      .withMessage('You cannot add more than three additional images!'),
    body('location')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Location cannot be more than 50 characters!'),
    body('condition')
      .optional()
      .isIn(['New', 'Used'])
      .withMessage('Please select New or Used'),
  ],
  productsController.updateProduct
);

module.exports = router;
