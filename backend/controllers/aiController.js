const Doctor = require("../models/Doctor.model");

const specialtyMap = {
  Dermatology: "Dermatologist",
  "Allergy and Immunology": "Allergist",
  "Infectious Disease": "Infectious Disease Specialist",
  "Family Medicine": "General Physician",
  Cardiology: "Cardiologist",
  Neurology: "Neurologist",
  Pediatrics: "Pediatrician"
};

// Helper: Call Gemini REST API with retries
async function callGemini(prompt, retries = 5) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) throw new Error("API Key not found");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  });

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body
      });

      if (res.status === 503) {
        console.warn("Gemini overloaded. Retrying in 2s...");
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }
      if (res.status === 429) {
        console.warn("Quota hit. Retrying in 60s...");
        await new Promise(r => setTimeout(r, 60000));
        continue;
      }
      if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return text;

    } catch (err) {
      if (attempt === retries - 1) throw err;
      console.warn(`Retrying Gemini call... attempt ${attempt + 1}`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
  throw new Error("Gemini failed after retries");
}

exports.analyzeSymptoms = async (req, res) => {
  try {
    const { message } = req.body;
    console.log("POST /analyze hit with message:", message);

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const prompt = `
The user said: "${message}"
You are a medical assistant. Analyze the text and return the output strictly in this JSON format:
{
  "symptoms": ["symptom1", "symptom2"],
  "possibleConditions": [
     { "name": "Condition A", "probability": "60%", "description": "Short description" },
     { "name": "Condition B", "probability": "30%", "description": "Short description" }
  ],
  "specialties": ["specialty1", "specialty2"],
  "recommendedAction": "One short line of advice"
}
`;
    const text = await callGemini(prompt);

    let parsed;
    try {
      parsed = JSON.parse(text.match(/\{[\s\S]*\}/)?.[0] || "{}");
    } catch {
      parsed = {
        symptoms: [],
        possibleConditions: [],
        specialties: [],
        recommendedAction: "Consider consulting with a healthcare provider."
      };
    }

    const dbSpecialties = parsed.specialties.map(s => specialtyMap[s] || s);

    const doctors = await Doctor.find({
      $or: dbSpecialties.map(s => ({
        specialty: { $regex: s, $options: "i" }
      }))
    });

    const response = {
      identifiedSymptoms: parsed.symptoms || [],
      summary: "Patient reports symptoms that may require medical attention.",
      possibleConditions: parsed.possibleConditions || [],
      recommendedAction: parsed.recommendedAction ||
        "Consider consulting with a healthcare provider.",
      doctors
    };

    res.json(response);
  } catch (error) {
    console.error("Error analyzing symptoms:", error);

    if (error.message.includes("429")) {
      return res.status(429).json({
        error: "Gemini quota exceeded. Please wait and try again later."
      });
    } else if (error.message.includes("503")) {
      return res.status(503).json({
        error: "Gemini is overloaded. Please try again shortly."
      });
    }

    res.status(500).json({ error: "Something went wrong" });
  }
};
