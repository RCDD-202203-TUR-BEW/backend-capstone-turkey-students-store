const mongoose = require('mongoose');
const logger = require('../utils/logger');

const isJest = process.env.IS_JEST;
let url = process.env.DB_URL;
if (isJest) url = process.env.TEST_DB_URL;

const connectToMongoAtlas = () => {
  mongoose.connect(url, { useNewUrlParser: true });

  const db = mongoose.connection;

  db.once('open', () => {
    logger.info('[+] Database connected');
    logger.info(`[+] Database connected to: ${url}`);
  });

  db.on('error', (err) => {
    logger.error('Database connection error: ', err);
  });
};

module.exports = connectToMongoAtlas;
