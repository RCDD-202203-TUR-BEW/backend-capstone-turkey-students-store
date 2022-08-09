const router = require('express').Router();
const productsController = require('../controllers/products');

router.get('/', productsController.getAllProducts);

// delete after testing
router.post('/', productsController.createProduct);

module.exports = router;
