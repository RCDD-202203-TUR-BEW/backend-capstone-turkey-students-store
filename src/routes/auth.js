const passport = require('passport');
const express = require('express');
const googleAuthJWT = require('../controllers/auth');

const router = express.Router();

// api/auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  googleAuthJWT
);

router.get('/logout', (req, res) => {
  res.end();
});

module.exports = router;
