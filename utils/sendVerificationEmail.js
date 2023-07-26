const nodemailer = require("nodemailer");

async function sendVerificationEmail(email, emailToken) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.MAIL_DOMAIN,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.MAIL_DOMAIN,
    to: email,
    subject: "Email Verification",
    text: `Please verify your email by clicking on the following link: 
         http://localhost:8080/users/verify-email?token=${emailToken}
         
         Do not reply to this email. This mailbox is not monitored and you will not receive a response.`,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = sendVerificationEmail;
