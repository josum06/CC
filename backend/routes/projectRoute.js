const express = require("express");
const router = express.Router();
const {
  getAllProjects,
  likeProject,
  getLikes,
  createProject,
  createCommentProject,
  getProjectComments,
  getProject,
} = require("../controllers/projectController");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post("/create-project", upload.single("image"), createProject);
router.get("/get-projects", getAllProjects);
router.get("/get-project/:userId", getProject);
router.route("/like/:projectId").patch(likeProject).get(getLikes);

router.post("/create-project-comment", createCommentProject);
router.get("/get-project-comments/:projectId", getProjectComments);

module.exports = router;
