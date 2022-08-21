// Import Node.js stream
// const stream = require('stream');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const storage = require('../config/index');

// The ID of your GCS bucket
const bucketName = 'student_store_recoded';

/**
 *
 * check if file name ends with .jpg or .jpeg
 * if not add extension .jpg
 *
 */
function parseFileName(fileName) {
  if (!fileName.match(/\.jpg$|\.jpeg$/)) fileName = `${fileName}.jpg`;
  return fileName;
}

function getExtension(filename) {
  const ext = path.extname(filename || '').split('.');
  return ext[ext.length - 1];
}

const uploadImage = (imageFile) =>
  new Promise((resolve, reject) => {
    const { buffer, mimetype, originalname } = imageFile;
    // make sure filename ends with .jpg
    const fileName = `.${getExtension(originalname)}`;

    // The new ID for your GCS file
    const destFileName = `g-${uuidv4()}${fileName}`;

    // Get a reference to the bucket
    const myBucket = storage.bucket(bucketName);

    // Create a reference to a file object
    const file = myBucket.file(destFileName);

    // write stream
    const fileStream = file.createWriteStream({
      resumable: false,
      metadata: {
        contentType: mimetype,
      },
    });

    fileStream
      .on('finish', () => {
        const url = `https://storage.googleapis.com/${myBucket.name}/${file.name}`;
        resolve(url);
      })
      .on('error', (err) => {
        reject(err);
      })
      .end(buffer);
  });

module.exports = uploadImage;
