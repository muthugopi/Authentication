import transporter from "../config/mailTransporter.mjs";

export const sendMail = async ({ to, subject, html, text }) => {
  await transporter.sendMail({
    from: `"Authenticate Web App" <${process.env.EMAIL}>`,
    to,
    subject,
    text,
    html
  });
};
