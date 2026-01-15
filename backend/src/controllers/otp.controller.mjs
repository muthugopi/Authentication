import { sendMail } from "./mail.controller.mjs";


const otpStore = {};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email required" });
  }

  const otp = generateOTP();

  otpStore[email] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 
  };

  try {
    await sendMail({
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. Valid for 5 minutes.`,
      html: `
        <h2>OTP Verification</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// VERIFY OTP
export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  const data = otpStore[email];

  if (!data) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (Date.now() > data.expiresAt) {
    return res.status(400).json({ message: "OTP expired" });
  }

  if (Number(otp) !== data.otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  delete otpStore[email];

  res.json({ success: true, message: "OTP verified successfully" });
};
