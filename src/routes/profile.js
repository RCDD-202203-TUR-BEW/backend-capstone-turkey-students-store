const router = require('express').Router();
const ErrorResponse = require('../utils/errorResponse');
const profileController = require('../controllers/profile');
const { verifyUser } = require('../middlewares/authenticate');

router.get('/', verifyUser, profileController.getMyProfile);

module.exports = router;
