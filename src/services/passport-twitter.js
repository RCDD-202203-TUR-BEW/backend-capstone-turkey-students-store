const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const User = require('../models/user');

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: process.env.TWITTER_CALLBACK_URL,
      includeEmail: true,
    },
    async (token, tokenSecret, profile, cb) => {
      console.log(profile);

      try {
        // User create or find exiting
        let user = await User.findOne({ providerId: `twitter-${profile.id}` });
        if (!user) {
          user = await User.create({
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
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
