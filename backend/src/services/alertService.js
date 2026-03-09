// backend/services/alertService.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

async function sendAlertEmail(touristId, location, userEmail) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: "kavyarajoria9691@gmail.com", // all admins
    subject: "🚨 Tourist Emergency Alert!",
    html: `
      <h2>Emergency Alert</h2>
      <p><strong>Tourist ID:</strong> ${touristId}</p>
      <p><strong>User Email:</strong> ${userEmail}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p>This user is in trouble. Please respond immediately 🚨</p>
    `,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendAlertEmail };
