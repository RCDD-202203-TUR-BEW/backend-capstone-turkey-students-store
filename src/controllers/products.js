/* eslint-disable no-unused-vars */
const { validationResult } = require('express-validator');

const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

const Order = require('../models/order');

const uploadImage = require('../services/gcs-service');

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

exports.getRequstedBuyers = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate('requstedBuyers');
  if (!product) {
    return next(new ErrorResponse(`Product with id ${id} not found!`, 404));
  }
  return res.status(200).json({ success: true, data: product.requstedBuyers });
};

exports.sellProduct = async (req, res, next) => {
  const { id, userId } = req.params;
  const { notes } = req.body;
  const orderNotes = notes || '';
  let product;
  try {
    product = await Product.findById(id);
  } catch (err) {
    return next(new ErrorResponse(`Product not found!`, 404));
  }
  const order = await Order.create({
    orderItems: [{ item: product._id, quantity: 1 }],
    buyer: userId,
    totalPrice: product.price,
    notes: orderNotes,
  });
  if (order.orderItems.quantity === 0) {
    // eslint-disable-next-line no-undef
    return next(new ErrorMessage(`Product is sold!`));
  }
  return res.status(200).json({ success: true, data: order });
};
