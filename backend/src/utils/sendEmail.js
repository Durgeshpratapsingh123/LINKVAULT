const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"LinkVault" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log(`✉️ Email sent to ${to}`);
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmail;