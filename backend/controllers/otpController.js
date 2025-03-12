const Otp = require('../models/otpModel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Send OTP
exports.sendOtp = async (req, res, next) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const otpCode = crypto.randomInt(100000, 999999).toString();

        await Otp.create({ email, otp: otpCode });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otpCode}. It is valid for 5 minutes.`,
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        next(error);
    }
};

// Verify OTP
exports.verifyOtp = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        const otpEntry = await Otp.findOne({ email, otp });
        if (!otpEntry) return res.status(400).json({ error: 'Invalid or expired OTP' });

        await Otp.deleteOne({ email, otp });
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        next(error);
    }
};
