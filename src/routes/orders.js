const router = require('express').Router();
const auth = require('../middlewares/authenticate');

const ordersController = require('../controllers/orders');

router.get('/', auth.verifyUser, ordersController.getMyOrders);
router.get('/:id', auth.verifyUser, ordersController.getOrder);

module.exports = router;
