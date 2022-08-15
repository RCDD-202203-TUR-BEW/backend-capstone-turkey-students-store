const router = require('express').Router();

const ErrorResponse = require('../utils/errorResponse');
const profileController = require('../controllers/profile');
const { verifyUser } = require('../middlewares/authenticate');

router.get('/', verifyUser, profileController.getMyProfile);

const auth = require('../middlewares/authenticate');

router.get('/products', auth.verifyUser, profileController.getUserProducts);

module.exports = router;
