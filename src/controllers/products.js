const { validationResult } = require('express-validator');

const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');
const uploadImage = require('../services/gcs-service');

exports.createProduct = async (req, res, next) => {
  // check for validation errors first
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res
      .status(400)
      .json({ success: false, errors: validationErrors.array() });
  }

  // check for coverImage (required)
  if (!req.files.coverImage) {
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
