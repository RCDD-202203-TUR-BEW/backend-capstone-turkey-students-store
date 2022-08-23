require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

const SENDER_ADDRESS = '"Student Store" <studentstore_recoded@hotmail.com>';

const sendEmail = async (receivers, name) => {
  try {
    // create transporter object
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // prepare html to send
    const htmlToSend = `
            <h1>Dear ${name},</h1></br>
            <p>We have received your generous contribution.
            You just helped a student to dream higher and achieve possibly more!</p></br>
            <img src="https://storage.googleapis.com/recoded_studen_store_bucket/charitable-giving-hands2.jpg"
                alt="donation">
        `;

    // properties and info of the mail
    const info = await transporter.sendMail({
      from: SENDER_ADDRESS, // sender address
      to: receivers, // list of receivers
      subject: 'Student Store: We welcome your contribution!', // Subject line
      text: 'We appreciate your will to help students and watch them grow!', // plain text body
      // html body
      html: htmlToSend,
    });
    logger.info(`Message sent: ${info.messageId}`);
  } catch (error) {
    logger.info(`Error is the following: \n${error}`);
  }
};

module.exports = sendEmail;
