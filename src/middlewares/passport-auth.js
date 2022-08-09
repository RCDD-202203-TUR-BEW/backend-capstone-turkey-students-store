const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      // Fixed 'Missing required parameter: scope
      scope: ['profile', 'email', 'openid'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // User create or find exiting
        let user = await User.findOne({ providerId: `google-${profile.id}` });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            provider: 'Google',
            providerId: `google-${profile.id}`,
          });
        }
        cb(null, user);
      } catch (error) {
        cb(error, null);
      }
    }
  )
);
