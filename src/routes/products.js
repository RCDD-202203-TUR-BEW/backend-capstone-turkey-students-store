const router = require('express').Router();
const ErrorResponse = require('../utils/errorResponse');

const productsController = require('../controllers/products');

router.patch('/:id', productsController.updateProduct);
router.post('/', productsController.createProduct);

module.exports = router;
