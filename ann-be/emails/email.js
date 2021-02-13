const express = require("express");
const app = express();
const router = express.Router();
const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "37195f8d35d947",
    pass: "56a6b4f73e969c"
  }
});

const mailData = {
  from: 'phillipjuanvanderberg@gmail.com',
  to: 'bt1phillip@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!',
  html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
};

function sendEmail() {
  transporter.sendMail(mailData, function (err, info) {
    if(err)
      console.log(err)
    else
      console.log(info);
 });
}

module.exports = sendEmail;