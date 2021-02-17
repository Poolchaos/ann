const express = require("express");
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs')
const path = require('path')
const logger = require('../logger');

const CONFIRM_REGISTRATION = fs.readFileSync(path.resolve(__dirname, './confirm-registration.html'), 'utf8')

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "37195f8d35d947", // move to dontenv
    pass: "56a6b4f73e969c"
  }
});


function sendEmail(user) {
  
  let mailData = {
    from: 'noreply@ann.com',
    to: user.email,
    subject: 'noreply',
    html: CONFIRM_REGISTRATION.replace('${ann_token}', user.token),
  };

  transporter.sendMail(mailData, function (err, info) {
    if(err) {
      console.log(err)
    } else {
      console.log(info);
      log('Confirm registration email sent', user.email, user._id);
    }
 });
}

const log = function(message, email, userId) {
  logger.info(message, {
    email,
    userId,
    domain: 'email'
  });
}

module.exports = sendEmail;