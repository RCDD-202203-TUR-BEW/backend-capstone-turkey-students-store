const router = require('express').Router();
const auth = require('../middlewares/authenticate');

const ordersController = require('../controllers/orders');

router.get('/', auth.verifyUser, ordersController.getMyOrders);

// DELETE AFTER TESTING
router.post('/new', auth.verifyUser, ordersController.giveOrder);

module.exports = router;
