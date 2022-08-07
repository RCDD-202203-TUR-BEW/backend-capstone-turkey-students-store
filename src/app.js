const express = require('express');
require('express-async-errors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger.json');
const routes = require('./routes');
const logger = require('./utils/logger');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const connectToMongoAtlas = require('./db/connection');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.use(errorHandler);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  logger.info('[+] listening on port 3000');
  connectToMongoAtlas();
});
