const express = require("express");
const { ClerkExpressWithAuth, users } = require("@clerk/clerk-sdk-node");
const User = require("../models/User.js"); // Mongoose model
const authController = require("../controllers/authController.js");
const router = express.Router();

router.post("/save-user", authController.signUp);

module.exports = router;
