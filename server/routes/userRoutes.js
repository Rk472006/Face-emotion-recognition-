const express = require("express");
const router = express.Router();
const  User  = require("../models/User");
router.post("/register", async (req, res) => {
  const { email, uid } = req.body;

  // Basic validation
  if (!uid || !email) {
    return res.status(400).json({ error: "uid and email are required" });
  }

  try {
    const existingUser = await User.findOne({ firebaseUid: uid });
    if (existingUser) {
      return res.status(200).json({ message: "User already registered" });
    }

    const user = new User({ firebaseUid: uid, email });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("MongoDB error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
