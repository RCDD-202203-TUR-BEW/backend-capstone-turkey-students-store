const { validationResult } = require('express-validator');

const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');
const uploadImage = require('../services/gcs-service');

exports.getAllProducts = async (req, res, next) => {
  const allProducts = await Product.find();
  return res.status(200).json({ success: true, data: allProducts });
};

// eslint-disable-next-line consistent-return
exports.removeProduct = async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) {
    next(new ErrorResponse('Product ID is required', 400));
  }
  // const product = await Product.findById(productId);
  // if (!product) {
  //   next(new ErrorResponse('Product not found', 404));
  // }
  try {
    await Product.deleteOne({ _id: productId });
    return res
      .status(200)
      .json({ success: true, data: 'Product deleted successfully.' });
  } catch (error) {
    next(new ErrorResponse('Product not found', 404));
  }
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


exports.requestProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const buyerId = req.user._id;
    const product = await Product.findOne({ _id: productId });
    // check if the product is not null
    if (product) {
      // If it's Sold out
      if (product.status === 'Sold') {
        return next(new ErrorResponse('Product has been sold out!', 410));
      }
      // check if the seller and the buyer same person
      if (buyerId.toString() === product.seller?.toString()) {
        return next(
          new ErrorResponse('You can not request your own product!', 400)
        );
      }
      const checkId = product.requestedBuyers.findIndex(
        (val) => val.toString() === buyerId.toString()
      );
      if (checkId === -1) {
        product.requestedBuyers.push(buyerId);
        await product.save();
      }
      return res
        .status(200)
        .json({ success: true, message: 'Your request to the product has been made' });
    }

    return res
      .status(404)
      .json({ success: true, data: { message: 'Product not found!' } });
  } catch (error) {
    console.log(error);
  }
exports.getRequstedBuyers = async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate({
    path: 'requestedBuyers',
    select: 'firstName lastName email phoneNumber address',
  });
  if (!product) {
    return next(new ErrorResponse(`Product with id ${id} not found!`, 404));
  }
  return res.status(200).json({ success: true, data: product.requestedBuyers });
};

exports.getProduct = async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorResponse('Product not found!', 404));
  }
  return res.status(200).json({ success: true, data: product });
};
