
const nodemailer = require('nodemailer');

//認証情報
const auth = require('../../secret/GmailConfig.json')

const transport = {
  service: "gmail",
  auth,
};

exports.send = (to, subject, text) => {
  const transporter = nodemailer.createTransport(transport);

  const mailOptions = {
    to: to,//auth.user
    subject: subject,
    text: text,
  };

  transporter.sendMail(mailOptions, (err, response) => {
    if(err)console.log(err);
  });
}