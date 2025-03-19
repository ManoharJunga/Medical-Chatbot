const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Otp = require("../models/otpModel");
const jwt = require("jsonwebtoken");

// 📌 Setup Nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // Use SSL if port 465
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// 📌 Register User
const registerUser = async (req, res, next) => {
    try {
        console.log("📩 Register request received:", req.body);
        const { name, email, phone, password, dob, gender } = req.body;

        if (!name || !email || !phone || !password || !dob || !gender) {
            console.log("⚠️ Missing required fields");
            return res.status(400).json({ error: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            console.log("⚠️ Invalid email format");
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("❌ Email already exists:", email);
            return res.status(400).json({ error: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔐 Hashed Password:", hashedPassword);

        const newUser = new User({ 
            name, email, phone, password: hashedPassword, dob: new Date(dob), gender, isVerified: false
        });
        await newUser.save();

        console.log("✅ User registered successfully");
        res.status(201).json({ message: "User registered! Please verify your email using OTP." });
    } catch (error) {
        console.error("🚨 Registration Error:", error);
        next(error);
    }
};

// 📌 Send OTP
const sendOtp = async (req, res, next) => {
    try {
        console.log("📩 OTP request received:", req.body);
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        const otpCode = crypto.randomInt(100000, 999999).toString();
        await Otp.create({ email, otp: otpCode, createdAt: new Date() });
        console.log(`🔢 Generated OTP: ${otpCode} for ${email}`);

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Your OTP Code",
            text: `Your OTP code is ${otpCode}. It is valid for 5 minutes.`,
        });
        
        res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("🚨 Error sending OTP:", error);
        next(error);
    }
};

// 📌 Verify OTP
const verifyOTP = async (req, res, next) => {
    try {
        console.log("📩 OTP verification request received:", req.body);
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

        const otpEntry = await Otp.findOne({ email });
        if (!otpEntry || otpEntry.otp !== otp || Date.now() > otpEntry.createdAt.getTime() + 5 * 60 * 1000) {
            console.log("❌ Invalid or expired OTP");
            await Otp.deleteOne({ email }); 
            return res.status(400).json({ error: "Invalid or expired OTP" });
        }

        await User.findOneAndUpdate({ email }, { isVerified: true });
        await Otp.deleteOne({ email });
        console.log("✅ OTP verified successfully");

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("🚨 Error verifying OTP:", error);
        next(error);
    }
};

// 📌 Login User
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: "User not found" });

        // ✅ Check if user is verified (No approval needed)
        if (!user.isVerified) return res.status(400).json({ error: "Please verify your email first" });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Generate JWT
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        console.error("🚨 Error during login:", error);
        next(error);
    }
};



const changePassword = async (req, res, next) => {
    try {
        console.log("🔄 Change password request received:", req.body);

        const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

        if (!email || !currentPassword || !newPassword || !confirmNewPassword) {
            console.log("⚠️ Missing fields in change password request");
            return res.status(400).json({ error: "All fields are required" });
        }

        // ✅ Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ User not found for email:", email);
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User found:", user.email);

        // ✅ Verify current password
        console.log("🔑 Verifying current password...");
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        console.log("🔍 Password match result:", isMatch);

        if (!isMatch) {
            console.log("❌ Incorrect current password for:", email);
            return res.status(400).json({ error: "Incorrect current password" });
        }

        // ✅ Check if new passwords match
        if (newPassword !== confirmNewPassword) {
            console.log("❌ New passwords do not match");
            return res.status(400).json({ error: "New passwords do not match" });
        }

        // ✅ Hash new password
        console.log("🔐 Hashing new password...");
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        console.log("✅ New hashed password generated");

        // ✅ Update password in DB
        user.password = hashedNewPassword;
        await user.save();
        console.log("✅ Password updated successfully for:", email);

        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        console.error("🚨 Error changing password:", error);
        next(error);
    }
};


module.exports = { registerUser, sendOtp, verifyOTP, loginUser, changePassword };
