const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  createPost,
  getPosts,
  createComment,
  getComments,
  likePost,
} = require("../controllers/userPostController");

// Configure storage for videos and images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Save files in 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Unique file name
  },
});

// File filter to allow only images and videos
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype.startsWith("video/")
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limit file size to 50MB
});

router.post("/create-post", upload.single("file"), createPost);
router.get("/getAll-post", getPosts);
router.post("/create-comment", createComment);
router.get("/get-comments/:postId", getComments);
router.patch("/like/:postId/like-toggle", likePost);
// router.get("/get-post", getPosts);

module.exports = router;
