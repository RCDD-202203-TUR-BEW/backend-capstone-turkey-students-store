const express = require('express');
require('express-async-errors');
const routes = require('./routes');
const errorHandler = require('./middlewares/error');
require('dotenv').config();
const connectToMongoAtlas = require('./db/connection');

const app = express();

const port = process.env.PORT || 3000;

app.use('/api', routes);

app.use(errorHandler);

app.listen(port, () => {
  console.log('listening on port 3000');
  connectToMongoAtlas();
});
