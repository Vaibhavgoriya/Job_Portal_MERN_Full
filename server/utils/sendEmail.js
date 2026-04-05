import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // set EMAIL_USER in .env
      pass: process.env.EMAIL_PASS, // set EMAIL_PASS in .env
    },
  });

  await transporter.sendMail({
    from: `"Job Portal" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};

export default sendEmail;
