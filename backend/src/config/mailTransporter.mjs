import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: process.env.EMAIL, 
    pass: process.env.EMAIL_PASS 
  },
  logger: true,
  debug: true,   
});


transporter.verify((err, success) => {
  if (err) console.log("SMTP error:", err);
  else console.log("SMTP ready:", success);
});

export default transporter;
