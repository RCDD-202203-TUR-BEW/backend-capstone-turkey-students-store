const express = require('express');

const app = express();
require('express-async-errors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config();
// require('./middlewares/passport.config');
// require('./middlewares/passport-auth');
require('./services/passport.config');
const session = require('express-session');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const errorHandler = require('./middlewares/error');
const logger = require('./utils/logger');
const swaggerDocument = require('../swagger.json');
const routes = require('./routes');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY,
  })
);
const { connectToMongoAtlas } = require('./db/connection');

app.use(express.json());

const port = process.env.PORT || 3000;

app.use(cookieParser(process.env.SECRET_KEY));
app.use(encryptCookieNodeMiddleware(process.env.SECRET_KEY));

app.use(passport.initialize());

app.use('/api', routes);

app.use(errorHandler);
app.use(passport.initialize());
app.use(passport.session());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info(`listening on port ${port}`);
  connectToMongoAtlas();
});
// if (process.env.NODE_ENV !== 'test') {
//   app.listen(port, () => {
//     logger.info(`listening on ${port}`);
//   });
// }

module.exports = app;
