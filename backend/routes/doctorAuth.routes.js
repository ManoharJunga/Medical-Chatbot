const express = require("express");
const { registerDoctor, verifyDoctor, loginDoctor } = require("../controllers/doctorAuth.controller");

const router = express.Router();

router.post("/register", registerDoctor);
router.get("/verify/:token", verifyDoctor);
router.post("/login", loginDoctor);

module.exports = router;
