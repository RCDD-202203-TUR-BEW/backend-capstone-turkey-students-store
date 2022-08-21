// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Creates a client
const storage = new Storage({
  keyFilename: path.join(__dirname, '../student-store-gcs.json'),
  projectId: 'student-store-359018',
});

module.exports = storage;
