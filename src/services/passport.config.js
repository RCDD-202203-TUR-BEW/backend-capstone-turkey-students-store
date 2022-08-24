const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await User.findOne({ providerId: `facebook-${profile.id}` });
        if (!user) {
          user = await User.create({
            providerId: `facebook-${profile.id}`,
            provider: 'facebook',
            firstName:
              profile.name.givenName || profile.displayName.split(' ')[0],
            lastName:
              profile.name.familyName || profile.displayName.split(' ')[1],
          });
        }

        cb(null, user);
      } catch (error) {
        cb(error, null);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email', 'openid'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // User create or find exiting
        let user = await User.findOne({ providerId: `google-${profile.id}` });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            username: profile.emails[0].value.substring(
              0,
              profile.emails[0].value.indexOf('@')
            ),
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            profilePhoto: profile.photos[0].value,
            provider: 'google',
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

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      includeEmail: true,
    },
    async (token, tokenSecret, profile, cb) => {
      try {
        let user = await User.findOne({ providerId: `twitter-${profile.id}` });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            firstName: profile.displayName.split(' ')[0],
            lastName: profile.displayName.split(' ')[1],
            provider: 'twitter',
            providerId: `twitter-${profile.id}`,
          });
        }
        cb(null, user);
      } catch (error) {
        cb(error, null);
      }
    }
  )
);
