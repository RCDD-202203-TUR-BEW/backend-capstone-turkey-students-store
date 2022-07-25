const mongoose = require('mongoose');
const logger = require('../utils/logger');

const url = process.env.DB_URL;

const connectToMongoAtlas = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;

  db.once('open', () => {
    logger.info('Database connected: ', url);
  });

  db.on('error', (err) => {
    logger.error('Database connection error: ', err);
  });
};

module.exports = connectToMongoAtlas;
