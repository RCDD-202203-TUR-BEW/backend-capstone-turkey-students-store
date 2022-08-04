const router = require('express').Router();
const passport = require('passport');
const ErrorResponse = require('../utils/errorResponse');
const sendJwtToken = require('../controllers/auth');

router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/error',
  }),
  sendJwtToken
);

module.exports = router;
