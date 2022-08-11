const express = require('express');
require('express-async-errors');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const { expressjwt: jwt } = require('express-jwt');
const swaggerUi = require('swagger-ui-express');
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

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

require('./middlewares/passport-auth');

app.use(passport.initialize());

app.use('/api', routes);
// app.use('/', (req, res, next) => {
//   res.send('Hello World!');
// });

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    connectToMongoAtlas();
    logger.info(`listening on ${port}`);
  });
}

module.exports = app;
