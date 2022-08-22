// Imports the Google Cloud client library
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Creates a client
const storage = new Storage({
  keyFilename: path.join(
    __dirname,
    '../recoded-student-store-405a9b1020bb.json'
  ),
  projectId: 'recoded-student-store',
});

module.exports = storage;
