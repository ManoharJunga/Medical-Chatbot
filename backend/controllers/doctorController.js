const Doctor = require("../models/Doctor");
const { getSuggestedSpecialty } = require("../services/geminiService");
const { getGoogleDoctors } = require("../services/googlePlacesService");

const findDoctors = async (req, res) => {
  const { symptoms, userLocation } = req.body;

  try {
    // Get suggested specialty from AI
    const suggestedSpecialty = await getSuggestedSpecialty(symptoms);

    // Find doctors in the database
    const doctors = await Doctor.find({
      symptoms: { $in: symptoms.toLowerCase().split(",") },
    });

    // If no doctors are found, fetch from Google Places API
    if (doctors.length === 0) {
      const googleDoctors = await getGoogleDoctors(userLocation);
      return res.json({ doctors: googleDoctors });
    }

    res.json({ doctors });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};

module.exports = { findDoctors };
