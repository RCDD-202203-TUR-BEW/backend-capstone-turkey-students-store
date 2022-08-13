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
      .isObject()
      .withMessage(
        'Location format is as follows; location{ lat: Number, lng: Number }'
      )
      .not()
      .isEmpty()
      .withMessage('Location cannot be empty!'),
    body('location.lat')
      .not()
      .isEmpty()
      .withMessage('Latitude cannot be empty!')
      .isNumeric()
      .withMessage('Latitude should be a number!')
      .custom((lat) => lat >= -90 && lat <= 90)
      .withMessage('Latitude should be between -90 and 90!'),
    body('location.lng')
      .not()
      .isEmpty()
      .withMessage('Longitude cannot be empty!')
      .isNumeric()
      .withMessage('Longitude should be a number!')
      .custom((lng) => lng >= -180 && lng <= 180)
      .withMessage('Longitude should be between -180 and 180!'),
  ],
  productsController.createProduct
);

router.get('/', productsController.getAllProducts);

router.get('/:id', productsController.getProduct);

module.exports = router;
