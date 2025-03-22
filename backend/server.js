require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const chatWindowRoutes = require("./routes/chatWindowRoutes");
const userRoutes = require("./routes/userRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const doctorAuthRoutes = require("./routes/doctorAuth.routes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chat-windows", chatWindowRoutes);
app.use("/api/users", userRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth/doctors", doctorAuthRoutes);


console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));