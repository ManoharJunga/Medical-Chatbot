const Doctor = require("../models/Doctor.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // Use SSL if port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Store OTP in-memory (For production, use Redis or DB)
const otpStore = {};

// ✅ 1. Send OTP to Doctor's Email
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if doctor exists
    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: "Doctor not found" });

    // Generate OTP
    const otp = otpGenerator.generate(6, { digits: true, specialChars: false });
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 }; // Expires in 10 mins

    // Send OTP via email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Your OTP for Doctor Verification",
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// ✅ 2. Verify OTP and Activate Doctor Account
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Check OTP validity
    if (!otpStore[email] || otpStore[email].expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (otpStore[email].otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark doctor as verified
    await Doctor.updateOne({ email }, { verified: true });
    delete otpStore[email]; // Remove OTP after successful verification

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "OTP verification failed", error });
  }
};

// ✅ 3. Doctor Registration (Modified to use OTP)
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, location, contact } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: "Doctor already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const doctor = new Doctor({ name, email, password: hashedPassword, specialty, location, contact, verified: false });
    await doctor.save();

    // Send OTP to email for verification
    const otp = otpGenerator.generate(6, { digits: true, specialChars: false });
    otpStore[email] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Doctor Registration OTP",
      text: `Your OTP for registration is: ${otp}. It expires in 10 minutes.`,
    });

    res.status(201).json({ message: "Doctor registered, OTP sent for verification" });
  } catch (error) {
    res.status(500).json({ message: "Error registering doctor", error });
  }
};

// ✅ 4. Doctor Login (Checks OTP verification)
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!doctor.verified) return res.status(403).json({ message: "Please verify your email using OTP" });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, doctor });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};
