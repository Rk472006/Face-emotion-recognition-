const express = require("express");
const router = express.Router();
const multer = require("multer");
const { cloudinary } = require("../utils/cloudinary");

// Memory storage to keep uploaded file in buffer
const storage = multer.memoryStorage();
const upload = multer({ storage }); 
router.post("/camera", async (req, res) => {
  try {
    const { imgData } = req.body;

    if (!imgData) {
      return res.status(400).json({ error: "No image data received" });
    }

    const uploadRes = await cloudinary.uploader.upload(imgData, {
      folder: "emotion-app",
    });

    return res.status(200).json({ imgUrl: uploadRes.secure_url });
  } catch (err) {
    console.error("Camera upload failed:", err);
    return res.status(500).json({ error: "Upload failed" });
  }
});
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const b64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;

    const uploadRes = await cloudinary.uploader.upload(dataURI, {
      folder: "emotion-app",
    });

    return res.status(200).json({ imgUrl: uploadRes.secure_url });
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Image upload failed" });
  }
});
module.exports = router;
