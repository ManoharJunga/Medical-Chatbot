const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const getSuggestedSpecialty = async (symptoms) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const aiResponse = await model.generateContent(
      `Extract symptoms and suggest a medical specialty for: ${symptoms}`
    );
    return aiResponse.response.text();
  } catch (error) {
    console.error("Gemini AI Error:", error);
    return null;
  }
};

module.exports = { getSuggestedSpecialty };
