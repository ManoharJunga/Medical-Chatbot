const axios = require("axios");

const getGoogleDoctors = async (userLocation) => {
  try {
    const googleApiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${userLocation.lat},${userLocation.lng}&radius=5000&type=doctor&key=${process.env.GOOGLE_API_KEY}`;

    const googleRes = await axios.get(googleApiUrl);
    return googleRes.data.results.map((place) => ({
      name: place.name,
      address: place.vicinity,
      location: place.geometry.location,
      contact: place.formatted_phone_number || "N/A",
    }));
  } catch (error) {
    console.error("Google Places API Error:", error);
    return [];
  }
};

module.exports = { getGoogleDoctors };
