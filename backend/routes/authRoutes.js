const  express = require("express");
const { ClerkExpressWithAuth, users } = require("@clerk/clerk-sdk-node");
const  User =  require("../models/User.js"); // Mongoose model

const router = express.Router();

// Middleware to authenticate requests
router.post("/register", ClerkExpressWithAuth(), async (req, res) => {
  try {
    const { enrollmentNumber, fullName } = req.body;
    const clerkUserId = req.auth.userId;

    if (!clerkUserId || !enrollmentNumber) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ enrollmentNumber });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      clerkUserId,
      enrollmentNumber,
      fullName,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

module.exports = router;
