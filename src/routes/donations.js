const router = require('express').Router();
// const ErrorResponse = require('../utils/errorResponse');
const { body } = require('express-validator');

const donationController = require('../controllers/donations');

router.post(
  '/',
  body('amount')
    .custom((amount) => amount === 10 || amount === 25 || amount === 50)
    .withMessage('Invalid donation amount!'),
  donationController.donateMoney
);

router.get('/payment/success', donationController.paymentSuccess);
router.get('/payment/failure', donationController.paymentFailure);

module.exports = router;
