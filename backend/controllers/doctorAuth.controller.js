const Doctor = require("../models/Doctor.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT == 465, // Use SSL if port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Doctor Registration
exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, specialty, location, contact } = req.body;

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) return res.status(400).json({ message: "Doctor already registered" });

    const doctor = new Doctor({ name, email, password, specialty, location, contact });
    await doctor.save();

    // Send email verification
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
    const verificationLink = `http://localhost:5000/api/doctors/verify/${token}`;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Verify your account",
      text: `Click the link to verify: ${verificationLink}`,
    });

    res.status(201).json({ message: "Doctor registered, please verify email" });
  } catch (error) {
    res.status(500).json({ message: "Error registering doctor", error });
  }
};

// Email Verification
exports.verifyDoctor = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    await Doctor.updateOne({ email }, { verified: true });
    res.send("Email verified successfully");
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Doctor Login
exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(400).json({ message: "Doctor not found" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (!doctor.verified) return res.status(403).json({ message: "Please verify your email" });

    const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, doctor });
  } catch (error) {
    res.status(500).json({ message: "Login error", error });
  }
};
