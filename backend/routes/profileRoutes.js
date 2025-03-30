const express = require("express");
const Profile = require("../models/User"); // Ensure the path is correct
const router = express.Router();

// ✅ GET User Profile by Username
router.get("/:username", async (req, res) => {
  try {
    const userProfile = await Profile.findOne({ username: req.params.username });
    if (!userProfile) return res.status(404).json({ message: "Profile not found" });

    res.json(userProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// ✅ Export Router
module.exports = router;

