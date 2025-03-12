const express = require("express");
const { registerUser, sendOtp, verifyOTP, approveUser } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/approve", approveUser); // Admin only

module.exports = router;
