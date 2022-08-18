const router = require('express').Router();
const auth = require('../middlewares/authenticate');

const ordersController = require('../controllers/orders');

router.get('/', auth.verifyUser, ordersController.getMyOrders);

module.exports = router;
