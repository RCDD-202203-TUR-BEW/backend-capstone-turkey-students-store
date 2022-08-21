const { validationResult } = require('express-validator');
// const ErrorResponse = require('../utils/errorResponse');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/donation');

exports.donateMoney = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }
  // get donation amount from query
  const { amount } = req.body;
  const donationInCents = amount * 100;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${amount} USD Donation`,
          },
          unit_amount: `${donationInCents}`,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://${req.headers.host}/api/donation/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://${req.headers.host}/api/donation/payment/failure`,
  });

  return res.status(201).json({ success: true, data: session.url });
};

exports.paymentSuccess = async (req, res, next) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  const amount = session.amount_total / 100;
  const donation = await Donation.create({
    amount,
    fullName: session.customer_details.name,
    email: session.customer_details.email,
  });
  return res.status(200).json({ success: true, data: donation });
};

exports.paymentFailure = async (req, res, next) =>
  res.status(400).json({ success: false, error: 'Transaction cancelled!' });
