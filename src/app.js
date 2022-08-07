const express = require('express');
const cookieParser = require('cookie-parser');
const { encryptCookieNodeMiddleware } = require('encrypt-cookie');
require('express-async-errors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const { connectToMongoAtlas } = require('./db/connection');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.use(cookieParser(process.env.SECRET));
app.use(encryptCookieNodeMiddleware(process.env.SECRET));
app.use('/api', routes);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info('[+] listening on port 3000');
  connectToMongoAtlas();
});

module.exports = app;
