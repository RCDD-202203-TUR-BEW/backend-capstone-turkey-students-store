const router = require('express').Router();
// const ErrorResponse = require('../utils/errorResponse');
const { body } = require('express-validator');

const donationController = require('../controllers/donation');

router.post(
  '/',
  body('donation')
    .custom((amount) => amount === 10 || amount === 25 || amount === 50)
    .withMessage('Invalid donation amount!'),
  donationController.donateMoney
);

module.exports = router;
