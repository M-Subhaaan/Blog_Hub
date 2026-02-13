const nodemailer = require("nodemailer");
const catchAsync = require("./catchAsync");

const sendEmail = catchAsync(async (options) => {
  //1) Create a Transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2) Define Email Options
  const emailOptions = {
    from: "Muhammad Subhan <chsubhaaan@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  //3)Send the Email
  await transporter.sendMail(emailOptions);
});

module.exports = sendEmail;
