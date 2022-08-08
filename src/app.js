const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

require('express-async-errors');
const cookieParser = require('cookie-parser');
const TwitterStrategy = require('passport-twitter').Strategy;
const passport = require('passport');
const session = require('express-session');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');

const swaggerUi = require('swagger-ui-express');
// const sessionToken = require('session-token');
const swaggerDocument = require('../swagger.json');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const { connectToMongoAtlas } = require('./db/connection');

require('express-async-errors');

require('dotenv').config();

passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/twitter/callback',
    },
    (_token, _tokenSecret, profile, cb) => cb(null, profile)
  )
);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));
const app = express();
const port = process.env.PORT || 3000;
// app.use
app.set('trust proxy', 1); // trust first proxy
// session
// https://expressjs.com/en/resources/middleware/session.html
app.use(
  session({
    secret: 'keyboard cat',
    token: 'sessionToken',
    resave: false,
    saveUninitialized: true,
    maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
    cookie: { secure: true },
  })
);

// sessionToken
// app.use(sessionToken);
app.use('/api', routes);
app.use(errorHandler);
app.use(express.json());

app.use(cookieParser(process.env.SECRET));
app.use(encryptCookieNodeMiddleware(process.env.SECRET));
app.use('/api', routes);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/twitter', passport.authenticate('twitter'));

app.get(
  '/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);
app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info('[+] listening on port 3000');
  connectToMongoAtlas();
});

module.exports = app;
