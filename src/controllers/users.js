const ErrorResponse = require('../utils/errorResponse');
const Product = require('../models/product');

/* This is an example of a router controller */
exports.getUser = async (req, res, next) => {
  /* const user = await User.findOne({});
  if (!user) {
    // This is an example of an error
    return next(new ErrorResponse('User not found', 404));
  }

  // This is an example of a successful response
  res.json({ success: true, data: user }); */
};
exports.updateProduct = async (req, res) => {
  Product.findByIdAndUpdate(
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
  )
    .then((product) => {
      res.status(200).json({
        message: 'product updated successfully',
        product,
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Error occured',
      });
    });
};
