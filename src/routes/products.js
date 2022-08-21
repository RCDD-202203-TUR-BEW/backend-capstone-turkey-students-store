const express = require('express');

const router = express.Router();
const { body } = require('express-validator');
const multer = require('multer');
const productsController = require('../controllers/products');
const ErrorResponse = require('../utils/errorResponse');
const auth = require('../middlewares/authenticate');
const productMiddleware = require('../middlewares/product');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // max 5 mb image size
});

router.post(
  '/',
  auth.verifyUser,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'images', maxCount: 3 },
  ]),
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
    body('type')
      .not()
      .isEmpty()
      .withMessage('Please select the type of the product!'),
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

router.delete(
  '/:id',
  auth.verifyUser,
  productMiddleware.verifyOwner,
  productsController.removeProduct
);
module.exports = router;
