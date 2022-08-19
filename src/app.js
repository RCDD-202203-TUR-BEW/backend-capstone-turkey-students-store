const express = require('express');

require('express-async-errors');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const { expressjwt: jwt } = require('express-jwt');
const swaggerUi = require('swagger-ui-express');
const session = require('express-session');

const swaggerDocument = require('../swagger.json');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const { connectToMongoAtlas } = require('./db/connection');
const User = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {},
  })
);

require('./middlewares/passport-auth');
require('./services/passport-twitter');
// require('./routes/auth');

app.use(passport.initialize());

app.use('/api', routes);
app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    connectToMongoAtlas();
    logger.info(`listening on ${port}`);
  });
}

module.exports = app;
