const router = require('express').Router();
const auth = require('../middlewares/authenticate');

const profileController = require('../controllers/profile');

router.get(
  '/products',
  auth.verifyUser,
  profileController.getMyProductsForSale
);

module.exports = router;
