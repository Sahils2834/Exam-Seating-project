const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendMail({ to, subject, text, html }) {
  try {
    if (!process.env.SMTP_USER) {
      console.warn("⚠ SMTP not configured, email skipped");
      return;
    }

    return await transporter.sendMail({
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to,
      subject,
      text,
      html
    });

  } catch (err) {
    console.log("EMAIL ERROR:", err.message);
  }
}

module.exports = { transporter, sendMail };
