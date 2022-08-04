const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: `http://localhost:${process.env.PORT}/api/auth/facebook/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(accessToken);
      const currentUser = await User.find({ providerId: profile.id });

      if (currentUser) {
        // console.log('user found');
        return done(null, currentUser);
      }
      try {
        const newUser = new User({
          providerId: profile.id,
          provider: profile.provider,
          firstName:
            profile.name.givenName || profile.displayName.split(' ')[0],
          lastName:
            profile.name.familyName || profile.displayName.split(' ')[1],
        });
        await newUser.save();
      } catch (error) {
        done(error, null);
      }
      // console.log(profile);
      return done(null, profile);
    }
  )
);
