const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createPost, getPosts } = require("../controllers/adminController");

const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

router.post("/create-post", upload.single("image"), createPost);
router.get("/get-post",getPosts)

module.exports = router;
