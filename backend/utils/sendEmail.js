// utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html, text, attachments }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Tandav Support" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
    attachments: attachments || [],
  });
};

module.exports = sendEmail;