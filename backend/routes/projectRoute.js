const express = require("express");
const router = express.Router();
const {
  createProject,
  getAllProjects,
  likeProject,
  getLikes,
} = require("../controllers/projectController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/create-project", upload.single("image"), createProject);
router.get("/get-projects", getAllProjects);
router.route("/like/:projectId").patch(likeProject).get(getLikes);

module.exports = router;
