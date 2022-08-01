const passport = require('passport');
const jwt = require('jsonwebtoken');
const express = require('express');

const router = express.Router();

// const port = process.env.PORT || 3000;

// api/auth/google
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email', 'openid'],
  })
);

router.get('/me', (req, res) => {
  console.log('GET /me req.user', req.user);
  res.json(req.user);
});

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    // Successful authentication, redirect home.
    const { name, email, providerId, profilePicture } = req.user;

    console.log('req.user:', req.user);
    const payload = {
      name,
      email,
      providerId,
      avatar: profilePicture,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: '14 days',
    });

    // 1st token is the cookies name
    res.cookie('token', token, {
      // added the signed
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 3600 * 24 * 14,
    });
    res.redirect('/');
  }
);

// router.get('/google/callback', (req, res) => {
//   console.log('CB triggerd');
//   res.end();
// });

router.get('/logout', (req, res) => {
  res.end();
});

module.exports = router;
