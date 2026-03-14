import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
      tls: {
        rejectUnauthorized: false, // આ SSL issues દૂર કરશે
      },
    });

    console.log("✅ Transporter created successfully");
    
    const mailOptions = {
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    console.log("📨 Sending mail...");
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error("❌ Email sending error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
    });
    throw new Error(`Email failed: ${error.message}`);
  }
};

export default sendEmail;