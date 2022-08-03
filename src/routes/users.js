const router = require('express').Router();
const ErrorResponse = require('../utils/errorResponse');

const usersController = require('../controllers/users');

router.get('/', usersController.getUser);
router.patch('/products/:productId', usersController.updateProduct);
//  router.patch('/products/:productId', isLogged, isAdmin,usersController.updateProduct)

module.exports = router;
