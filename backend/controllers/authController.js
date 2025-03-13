const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const Otp = require("../models/otpModel"); 

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
        const { name, email, phone, password, dob, gender } = req.body;

        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: "Email already exists" });

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = new User({ 
            name, 
            email, 
            phone, 
            password: hashedPassword, 
            dob, 
            gender, 
            isVerified: false // ✅ No need for approval
        });
        await newUser.save();

        res.status(201).json({ message: "User registered! Please verify your email using OTP." });
    } catch (error) {
        next(error);
    }
};

// 📌 Send OTP
const sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: "Email is required" });

        console.log(`📩 OTP request received for: ${email}`);

        const otpCode = crypto.randomInt(100000, 999999).toString();

        // Store OTP in DB with expiry time (5 minutes)
        await Otp.create({ email, otp: otpCode, createdAt: new Date() });

        console.log(`🔢 Generated OTP: ${otpCode} for ${email}`);

        // Send OTP via email
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
        console.log("📩 Received OTP verification request:", req.body);

        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required" });

        // Find OTP entry
        const otpEntry = await Otp.findOne({ email });
        if (!otpEntry) return res.status(400).json({ error: "OTP not found or expired" });

        console.log("🔍 OTP record found:", otpEntry);

        // Check OTP match
        if (otpEntry.otp !== otp) return res.status(400).json({ error: "Invalid OTP" });

        // Check OTP expiration (5 minutes)
        if (Date.now() > otpEntry.createdAt.getTime() + 5 * 60 * 1000) {
            await Otp.deleteOne({ email }); 
            return res.status(400).json({ error: "Expired OTP" });
        }

        // ✅ Mark user as verified
        const user = await User.findOneAndUpdate({ email }, { isVerified: true }, { new: true });
        if (!user) return res.status(404).json({ error: "User not found" });

        console.log("✅ OTP verified successfully for:", email);

        // Delete OTP entry after successful verification
        await Otp.deleteOne({ email });

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

// ✅ Export all functions correctly
module.exports = { registerUser, sendOtp, verifyOTP, loginUser };
