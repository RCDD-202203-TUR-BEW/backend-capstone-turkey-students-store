// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
const path = require('path');

const storage = new Storage({
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY,
  },
});

module.exports = storage;
