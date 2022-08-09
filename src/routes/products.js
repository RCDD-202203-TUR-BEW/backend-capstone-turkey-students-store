const router = require('express').Router();
const productsController = require('../controllers/products');

router.get('/', productsController.getAllProducts);

module.exports = router;
