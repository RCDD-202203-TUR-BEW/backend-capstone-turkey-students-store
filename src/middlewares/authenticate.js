const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const User = require('../models/user');
require('dotenv').config();

const opts = {};
opts.jwtFromRequest = (req) => req.signedCookies.token ?? req.cookies.token;
opts.secretOrKey = process.env.SECRET;

passport.use(
  new JwtStrategy(opts, (jwtPayload, done) => {
    User.findOne({ id: jwtPayload.userId }, (err, user) => {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      }
      return done(null, false);
      // or you could create a new account
    });
  })
);

exports.verifyUser = passport.authenticate('jwt', { session: false });
