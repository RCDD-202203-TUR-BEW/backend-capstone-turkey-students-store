const { validationResult } = require('express-validator');
// const ErrorResponse = require('../utils/errorResponse');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.donateMoney = async (req, res, next) => {
  console.log('HEADER:', req.headers);
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }
  // get donation amount from query
  const { donation } = req.body;
  const donationInCents = donation * 100;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${donation} USD Donation`,
          },
          unit_amount: `${donationInCents}`,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `http://${req.headers.host}/utils/payment_success.html`,
    cancel_url: `http://${req.headers.host}/utils/payment_failure.html`,
  });

  return res.status(201).json({ success: true, data: session.url });
};

/*
exports.getAllProducts = async (req, res, next) => {
  const allProducts = await Product.find();
  return res.status(200).json({ success: true, data: allProducts });
};

exports.createProduct = async (req, res, next) => {
  delete req.body.images; // A workaround for issue #58/1

  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  // check for coverImage (required)
  if (!req.files?.coverImage) {
    return next(new ErrorResponse('Cover image cannot be empty!', 404));
  }

  // cover image exists, upload cover image
  const coverImageUrl = await uploadImage(req.files.coverImage[0]);

  // set cover image
  req.body.coverImage = coverImageUrl;

  // if additional images exist, upload those images too
  let imageUrls = [];

  if (req.files.images && req.files.images.length > 0) {
    const uploadSingleImage = async (fileName) => {
      const url = await uploadImage(fileName);
      return url;
    };

    const uploadMultipleImages = async () => {
      const unresolvedPromises = req.files.images.map(uploadSingleImage);
      const results = await Promise.all(unresolvedPromises);
      return results;
    };
    imageUrls = (await uploadMultipleImages()) ?? [];

    // set images
    req.body.images = imageUrls;
  }
  // set seller as this user; get user's id from token -> req.user
  req.body.seller = req.user._id;

  const product = await Product.create(req.body);
  return res.status(201).json({ success: true, data: product });
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found!', 404));
  }
  return res.status(200).json({ success: true, data: product });
};
*/
