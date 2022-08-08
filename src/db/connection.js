const mongoose = require('mongoose');
const logger = require('../utils/logger');

// Use a separate test db when running jest
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

const closeDatabase = async () => {
  // await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const clearDatabase = async () => {
  const { collections } = mongoose.connection;
  // eslint-disable-next-line no-restricted-syntax, guard-for-in
  for (const key in collections) {
    // eslint-disable-next-line no-await-in-loop
    await collections[key].deleteMany();
  }
};

module.exports = {
  connectToMongoAtlas,
  closeDatabase,
  clearDatabase,
};
