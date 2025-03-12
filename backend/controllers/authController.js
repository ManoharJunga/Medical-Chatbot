const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const crypto = require("crypto");  // ✅ Ensure this is imported
const Otp = require("../models/otpModel");  // ✅ Ensure Otp model is imported

// 📌 Setup Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// 📌 Register User
const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password, dob, gender } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        const newUser = new User({ name, email, phone, password, dob, gender });
        await newUser.save();

        res.status(201).json({ message: "User registered! Please verify your email using OTP." });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
};

// 📌 Send OTP
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        console.log(`📩 OTP request received for: ${email}`);

        const otpCode = crypto.randomInt(100000, 999999).toString();
        await Otp.create({ email, otp: otpCode });

        console.log(`🔢 Generated OTP: ${otpCode} for ${email}`);

        transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otpCode}. It is valid for 5 minutes.`,
        }, (err, info) => {
            if (err) {
                console.error("🚨 Error sending email:", err);
                return res.status(500).json({ error: "Failed to send OTP email" });
            }
            console.log(`✅ OTP email sent successfully: ${info.response}`);
            res.status(200).json({ message: 'OTP sent successfully' });
        });

    } catch (error) {
        console.error("❌ Unexpected error:", error);
        next(error);
    }
};

// 📌 Verify OTP
const verifyOTP = async (req, res) => {
    try {
        console.log("📩 Received OTP verification request:", req.body);

        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // Find the OTP entry for this email
        const otpEntry = await Otp.findOne({ email });

        if (!otpEntry) {
            console.log("❌ No OTP found for email:", email);
            return res.status(400).json({ error: "OTP not found or expired" });
        }

        console.log("🔍 OTP record found:", otpEntry);

        if (otpEntry.otp !== otp) {
            console.log(`❌ Incorrect OTP: ${otp}, Expected: ${otpEntry.otp}`);
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Check if OTP is expired
        const otpExpires = otpEntry.createdAt.getTime() + 5 * 60 * 1000; // 5 minutes expiry
        if (Date.now() > otpExpires) {
            console.log("⏳ OTP expired for:", email);
            await Otp.deleteOne({ email }); // Remove expired OTP
            return res.status(400).json({ error: "Expired OTP" });
        }

        // ✅ Mark user as verified
        const user = await User.findOneAndUpdate({ email }, { isVerified: true });

        if (!user) {
            console.log("❌ User not found while verifying:", email);
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ OTP verified successfully for:", email);

        // Delete OTP after successful verification
        await Otp.deleteOne({ email });

        res.status(200).json({ message: "OTP verified successfully" });

    } catch (error) {
        console.error("🚨 Error verifying OTP:", error);
        res.status(500).json({ error: "Error verifying OTP" });
    }
};



// 📌 Approve User (Admin Only)
const approveUser = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ error: "User not found" });
        if (!user.isVerified) return res.status(400).json({ error: "User not verified" });

        user.isApproved = true;
        await user.save();

        res.status(200).json({ message: "User approved" });
    } catch (error) {
        res.status(500).json({ error: "Error approving user" });
    }
};

// ✅ Export all functions correctly
module.exports = { registerUser, sendOtp, verifyOTP, approveUser };
