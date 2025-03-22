const express = require("express");
const { registerDoctor, loginDoctor, sendOtp, verifyOtp } = require("../controllers/doctorAuth.controller");

const router = express.Router();

router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
