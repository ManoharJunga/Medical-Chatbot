const express = require("express");
const router = express.Router();
const { analyzeSymptoms } = require("../controllers/aiController");

router.post("/analyze", analyzeSymptoms);

module.exports = router;
