const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Register User
exports.registerUser = async (req, res) => {
  try {
      console.log("Incoming request:", req.body); // Log request body

      const { name, email, phone, password, dob, gender } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          console.log("User already exists:", existingUser); // Debug log
          return res.status(400).json({ error: "Email already exists" });
      }

      // Create new user
      const newUser = new User({ name, email, phone, password, dob, gender });
      await newUser.save();
      
      console.log("User registered successfully:", newUser);

      res.status(201).json({ message: "User registered! Please verify your email using OTP." });
  } catch (error) {
      console.error("Error registering user:", error); // Log errors
      res.status(500).json({ error: "Error registering user" });
  }
};


// ✅ Login User
exports.loginUser = async (req, res) => {
  try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: "Invalid email or password" });

      console.log("User found:", user); // Debugging

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

      if (!user.isVerified) {
          console.log("User is not verified!");
          return res.status(403).json({ error: "Please verify your email using OTP." });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      res.json({ message: "Login successful", token });
  } catch (error) {
      console.error("Login error:", error); // Debugging
      res.status(500).json({ error: "Error logging in" });
  }
};
