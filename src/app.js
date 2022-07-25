const express = require('express');
require('express-async-errors');
const routes = require('./routes');
const errorHandler = require('./middlewares/error');
const logger = require('./utils/Logger');
require('dotenv').config();

const app = express();

const port = process.env.NODE_LOCAL_PORT || 3000;

app.use('/api', routes);

app.use(errorHandler);

app.listen(port, () => {
  logger.error('listening on port 3000');
});
