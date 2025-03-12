require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");




const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);



app.listen(5001, () => console.log("Server running on port 5000"));
