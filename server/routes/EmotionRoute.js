const express = require("express");
const router = express.Router();
const  User  = require("../models/User");

const EMOTIONS = ["Happy", "Sad", "Angry", "Surprised", "Neutral"];
const axios = require("axios");
router.post("/from-url", async (req, res) => {
  const { uid, imgUrl } = req.body;

  if (!uid || !imgUrl) {
    return res.status(400).json({ error: "Missing uid or imgUrl" });
  }

  try {
    console.log("📤 Sending to Flask:", imgUrl);

    const flaskResponse = await axios.post("http://https://face-emotion-recognition-1-bh1p.onrender.com/predict", {
      url: imgUrl,
    });

    console.log("✅ Flask response:", flaskResponse.data);

    const result = flaskResponse.data;
    if (!result.results || result.results.length === 0) {
      return res.status(200).json({ message: "No faces detected", imgUrl });
    }

    const { expression, confidence } = result.results[0];

    const user = await User.findOne({ firebaseUid: uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    user.emotionLogs.push({
      emotion: expression,
      confidence,
      method: "Camera",
      imgUrl,
    });

    await user.save();

    res.json({ emotion: expression, confidence });

  } catch (err) {
    console.error("❌ FER API error:", err.message);
    console.error("🧾 Flask error response:", err.response?.data || "No detailed response");
    res.status(500).json({
      error: "FER API failed",
      details: err.message,
      flaskResponse: err.response?.data || null
    });
  }
});


router.get("/history/:uid", async (req, res) => {
  const { uid } = req.params;

  try {
    const user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user.emotionLogs);
  } catch (err) {
    console.error("Error fetching emotion history:", err);
    return res.status(500).json({ error: "Failed to fetch history" });
  }
});

module.exports = router;
