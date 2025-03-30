const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const Profile = require("./models/User.js"); 
// Load environment variables
dotenv.config();

// Ensure required environment variables exist
if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("❌ Missing required environment variables (JWT_SECRET or MONGO_URI) in .env file.");
  process.exit(1); // Stop the server if missing
}

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/auth", require("./routes/authRoutes")); // Authentication Routes
app.use("/api/profile", require("./routes/profileRoutes")); // Profile Routes

// Error Handling Middleware (Optional)
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.message);
  res.status(500).json({ message: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
