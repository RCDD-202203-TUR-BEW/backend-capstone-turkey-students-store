const router = require('express').Router();
const productsController = require('../controllers/products');

router.post('/', productsController.createProduct);

module.exports = router;
