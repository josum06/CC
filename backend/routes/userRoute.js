const express = require("express");
const multer = require("multer");
const {
  uploadProfile,
  getUserProfile,
  getUserProfileById,
  getPostsById,
  getAllUsers,
  searchUser,
  updateConnectionsPending,
  getPendingConnections,
  connectionAccepted,
  connectionRejected,
  getUserConnections,
  getCurrentConnections,
} = require("../controllers/userController");

const router = express.Router();

// Multer setup for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle profile upload
router.patch("/upload-profile", upload.single("idCardPhoto"), uploadProfile);
router.get("/profile/:clerkId", getUserProfile);   
router.get("/profileById/:userId", getUserProfileById); 
router.get("/posts/:userId", getPostsById); 
router.get("/getAllUsers", getAllUsers); // Assuming you have a function to get all users\
router.get("/searchUser", searchUser);

// updating connections
router.patch("/updateConnectionsPending/:userId", updateConnectionsPending);
router.patch("/connectionsAccepted/:userId", connectionAccepted);
router.patch("/connectionsRejected/:userId", connectionRejected);

// For getting the connections
router.get("/getPendingConnections/:userId", getPendingConnections);
router.get("/isPending/:userId", getCurrentConnections);
router.get("/getAllConnections/:userId", getUserConnections);

module.exports = router;
