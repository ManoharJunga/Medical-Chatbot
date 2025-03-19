const express = require("express");
const { registerUser, sendOtp, verifyOTP, loginUser, changePassword } = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginUser);
router.put("/password", changePassword)

module.exports = router;
