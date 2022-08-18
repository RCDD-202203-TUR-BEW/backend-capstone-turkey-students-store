const router = require('express').Router();
const { body } = require('express-validator');
const multer = require('multer');
const productsController = require('../controllers/products');
const auth = require('../middlewares/authenticate');

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
      .isObject()
      .withMessage(
        'Location format is as follows; location{ lat: Number, lng: Number }'
      )
      .isLength({ min: 1 })
      .withMessage('Location cannot be empty!'),
    body('location.lat')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Latitude cannot be empty!')
      .isNumeric()
      .withMessage('Latitude should be a number!')
      .custom((lat) => lat >= -90 && lat <= 90)
      .withMessage('Latitude should be between -90 and 90!'),
    body('location.lng')
      .optional()
      .isLength({ min: 1 })
      .withMessage('Longitude cannot be empty!')
      .isNumeric()
      .withMessage('Longitude should be a number!')
      .custom((lng) => lng >= -180 && lng <= 180)
      .withMessage('Longitude should be between -180 and 180!'),
    body('condition')
      .optional()
      .isIn(['New', 'Used'])
      .withMessage('Please select New or Used'),
  ],
  productsController.updateProduct
);

router.get('/', productsController.getAllProducts);

router.get('/:id', productsController.getProduct);

module.exports = router;
