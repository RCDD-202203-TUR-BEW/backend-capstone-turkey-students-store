const express = require('express');
require('express-async-errors');
const swaggerUi = require('swagger-ui-express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const { expressjwt: jwt } = require('express-jwt');

const swaggerDocument = require('../swagger.json');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const { connectToMongoAtlas } = require('./db/connection');
const User = require('./models/user');

const app = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
      scope: ['profile', 'email', 'openid'],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
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

app.use(passport.initialize());

app.use('/api', routes);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info(`listening on ${port}`);
  connectToMongoAtlas();
});

module.exports = app;
