const express = require("express");
const { findDoctors } = require("../controllers/doctorController");

const router = express.Router();

router.post("/find", findDoctors);

module.exports = router;
