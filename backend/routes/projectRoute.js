const express = require("express");
const router = express.Router();
const { createProject } = require("../controllers/projectController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/create-project", upload.single("image"), createProject);

module.exports = router;
