const router = require('express').Router();
// const ErrorResponse = require('../utils/errorResponse');
const { body } = require('express-validator');

const donationController = require('../controllers/donations');

router.post(
  '/',
  [
    body('amount')
      .isNumeric()
      .withMessage('Amount should be a number!')
      .custom((val) => val > 0)
      .withMessage('Amount should be greater than zero!'),
    body('token.card.name')
      .not()
      .isEmpty()
      .withMessage('Name cannot be empty!'),
    body('token.email').not().isEmpty().withMessage('Email cannot be empty!'),
  ],
  donationController.donateMoney
);

module.exports = router;
