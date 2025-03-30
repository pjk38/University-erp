require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { username, password } = req.body;
    console.log("Login Request:", username, password);
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return res.status(400).json({ message: "Incorrect username or password" });
      }
  
      console.log("User found:", user);
  
      // Compare hashed password
      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match:", isMatch);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
  
      res.json({ token, user: { username: user.username, role: user.role } });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Login error" });
    }
  };