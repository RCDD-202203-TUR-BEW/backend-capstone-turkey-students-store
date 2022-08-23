const express = require('express');
require('express-async-errors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const { expressjwt: jwt } = require('express-jwt');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const session = require('express-session');
const swaggerDocument = require('../swagger.json');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const { connectToMongoAtlas } = require('./db/connection');

connectToMongoAtlas();

const app = express();

const port = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:3000'];

const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    // allow requests with no origin
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg =
        'The CORS policy for this site does not ' +
        'allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

require('./services/passport.config');

app.use(passport.initialize());

app.use('/api', routes);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    logger.info(`listening on ${port}`);
  });
}

module.exports = app;
