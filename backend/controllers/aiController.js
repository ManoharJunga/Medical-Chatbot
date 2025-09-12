const Doctor = require("../models/Doctor.model");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

// Map Gemini specialties to DB specialties if needed
const specialtyMap = {
  Dermatology: "Dermatologist",
  "Allergy and Immunology": "Allergist",
  "Infectious Disease": "Infectious Disease Specialist",
  "Family Medicine": "General Physician",
  "Cardiology": "Cardiologist",
  Neurology: "Neurologist",
  Pediatrics: "Pediatrician"
};

exports.analyzeSymptoms = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("POST /analyze hit with message:", message);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      The user said: "${message}".
      Identify:
      1. List of possible symptoms mentioned.
      2. List of most relevant medical specialties for these symptoms.
      Return JSON in this format:
      {
        "symptoms": ["symptom1", "symptom2"],
        "specialties": ["specialty1", "specialty2"]
      }
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || "{}");
    } catch {
      parsed = { symptoms: [], specialties: [] };
    }

    console.log("Gemini Response:", parsed);

    // Map specialties to DB-compatible strings
    const dbSpecialties = parsed.specialties.map(s => specialtyMap[s] || s);

    // Step 3 — Find doctors in DB (case-insensitive partial match)
    const doctors = await Doctor.find({
      $or: dbSpecialties.map(s => ({ specialty: { $regex: s, $options: "i" } }))
    });

    console.log("Doctors fetched:", doctors);

    return res.json({
      detectedSymptoms: parsed.symptoms || [],
      detectedSpecialties: parsed.specialties || [],
      doctors
    });
  } catch (error) {
    console.error("Error analyzing symptoms:", error);
    res.status(500).json({ error: "Something went wrong" });
  }
};
