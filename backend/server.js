require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");
const authRoutes = require("./routes/authRoutes");


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/auth", authRoutes);

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
