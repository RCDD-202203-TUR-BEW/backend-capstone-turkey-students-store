const express = require('express');
require('express-async-errors');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();
const passport = require('passport');
require('./middlewares/passport.config');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const errorHandler = require('./middlewares/error');
const logger = require('./utils/logger');
const swaggerDocument = require('../swagger.json');
const connectToMongoAtlas = require('./db/connection');
const routes = require('./routes');

const port = process.env.PORT || 3000;
const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY,
  })
);

app.use(errorHandler);
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info(`listening on port ${port}`);
  connectToMongoAtlas();
});
