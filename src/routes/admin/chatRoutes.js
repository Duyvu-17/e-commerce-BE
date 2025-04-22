// src/routes/chatUploadRoutes.js

import express from "express";
import uploadChatImage from "../../middleware/chatUpload.js";

const router = express.Router();

router.post("/upload", uploadChatImage.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }


  const fileUrl = `/uploads/chat/${req.file.filename}`;
  res.json({ url: fileUrl });
});

export default router;
