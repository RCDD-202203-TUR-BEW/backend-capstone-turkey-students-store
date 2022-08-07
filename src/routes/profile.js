const router = require('express').Router();
const ErrorResponse = require('../utils/errorResponse');

const profilesController = require('../controllers/profiles');

router.get('/', profilesController.getAllProfiles);

module.exports = router;
