const { body, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

exports.updateProduct = async (req, res) => {
  body('title').isLength({ max: 150 });
  body('description').isEmpty();
  body('price').isEmpty();
  body('category').isEmpty();
  body('coverImage').isEmpty();
  // do I need to add validation for all fields in product??
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        coverImage: req.body.coverImage,
        images: req.body.images,
        type: req.body.type,
        location: req.body.location,
        status: req.body.status,
        condition: req.body.condition,
      },
    },
    { new: true }
  );
  return res.status(200).json({ success: true, data: product });
};
