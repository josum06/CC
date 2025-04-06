const express = require("express");
const router = express.Router();
const { createProject, getAllProjects, createCommentProject, getProjectComments } = require("../controllers/projectController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/create-project", upload.single("image"), createProject);
router.get("/get-projects", getAllProjects)
router.post("/create-project-comment", createCommentProject);
router.get("/get-project-comments/:projectId", getProjectComments);

module.exports = router;
