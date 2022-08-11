// Import Node.js stream
// const stream = require('stream');
const { v4: uuidv4 } = require('uuid');
const storage = require('../config/index');
const logger = require('../utils/logger');

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

const uploadImage = (imageFile) =>
  new Promise((resolve, reject) => {
    const { buffer, mimetype, originalname } = imageFile;
    // make sure filename ends with .jpg
    const fileName = parseFileName(originalname);

    // The new ID for your GCS file
    const destFileName = `g-${uuidv4()}-${fileName}`;

    // test
    // storage.getBuckets().then((buckets) => console.log('BUCKETS:', buckets));

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
        logger.info('Image successfully uploaded.');
        const url = `https://storage.googleapis.com/${myBucket.name}/${file.name}`;
        resolve(url);
      })
      .on('error', (err) => {
        reject(err);
      })
      .end(buffer);
  });

module.exports = uploadImage;
