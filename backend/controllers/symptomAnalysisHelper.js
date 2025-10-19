// symptomAnalysisHelper.js
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

async function callGemini(prompt, retries = 5) {
  const apiKey = process.env.GOOGLE_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });

  for (let i = 0; i < retries; i++) {
    const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body });
    if (res.status === 503) { await new Promise(r => setTimeout(r, 2000)); continue; }
    if (res.status === 429) { await new Promise(r => setTimeout(r, 60000)); continue; }
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  }
  throw new Error("Gemini failed");
}

exports.analyzeSymptomsInternal = async (text) => {
  const prompt = `
The user described their symptoms as follows:
"${text}"

Analyze the text and return the output strictly in this JSON format:

{
  "symptoms": ["symptom1", "symptom2"],
  "possibleConditions": [
    { "name": "Condition A", "probability": "60%", "description": "Short description" }
  ],
  "specialties": ["specialty1", "specialty2"],
  "recommendedAction": "One short line of advice"
}
`;

  let resultText = await callGemini(prompt);
  let parsed;
  try {
    parsed = JSON.parse(resultText.match(/\{[\s\S]*\}/)?.[0] || "{}");
  } catch {
    parsed = { symptoms: [], possibleConditions: [], specialties: [], recommendedAction: "Consult a doctor." };
  }

  const dbSpecialties = parsed.specialties.map(s => specialtyMap[s] || s);
  const doctors = await Doctor.find({
    $or: dbSpecialties.map(s => ({ specialty: { $regex: s, $options: "i" } }))
  });

  return {
    identifiedSymptoms: parsed.symptoms || [],
    possibleConditions: parsed.possibleConditions || [],
    recommendedAction: parsed.recommendedAction || "Consult a doctor.",
    doctors
  };
};
