const express = require("express");
const multer = require("multer");
const {
  uploadProfile,
  getUserProfile,
} = require("../controllers/userController");

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle profile upload
router.patch("/upload-profile", upload.single("idCardPhoto"), uploadProfile);
router.get("/profile/:clerkId", getUserProfile);

module.exports = router;
