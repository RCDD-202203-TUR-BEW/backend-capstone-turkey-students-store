const express = require('express');

const router = express.Router();
const productsController = require('../controllers/products');
const ErrorResponse = require('../utils/errorResponse');

router.delete('/:id', productsController.removeProduct);
router.get('/', (req, res) => {
  res.send('products');
});

module.exports = router;
