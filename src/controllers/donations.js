const { validationResult } = require('express-validator');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Donation = require('../models/donation');
const sendEmail = require('../services/mail');

exports.donateMoney = async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  const { token, amount } = req.body;
  try {
    await stripe.charges.create({
      source: token.id,
      amount,
      currency: 'usd',
    });

    const amountInUsd = amount / 100;
    const donation = await Donation.create({
      amount: amountInUsd,
      fullName: token.card.name,
      email: token.email,
    });
    // send verification mail
    await sendEmail(donation.email, donation.fullName);

    // return donation object
    return res.status(200).json({ success: true, data: donation });
  } catch (err) {
    return next(err);
  }
};
