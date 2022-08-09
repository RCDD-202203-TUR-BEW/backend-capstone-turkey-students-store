const router = require('express').Router();
const { body } = require('express-validator');
const productsController = require('../controllers/products');
const auth = require('../middlewares/authenticate');

router.post(
  '/',
  [
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
      body('category')
        .not()
        .isEmpty()
        .withMessage('Please type in a category!'),
      body('coverImage')
        .not()
        .isEmpty()
        .withMessage('Cover image cannot be empty!'),
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
    auth.verifyUser,
  ],
  productsController.createProduct
);

module.exports = router;
