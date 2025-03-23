const express = require("express");
const { ClerkExpressWithAuth, users } = require("@clerk/clerk-sdk-node");
const User = require("../models/User.js"); // Mongoose model
const authController = require("../controllers/authController.js");
const router = express.Router();

router.post("/save-user", authController.signUp);
router.post("/clerk-webhook", async (req, res) => {
    try {
        const { id, first_name, last_name, email_addresses, image_url } = req.body.data;

        if (!id) {
            return res.status(400).json({ error: "Invalid webhook data" });
        }

        // Find and update user in MongoDB
        const updatedUser = await User.findOneAndUpdate(
            { clerkId: id },
            {
                fullName: `${first_name} ${last_name}`,
                email: email_addresses[0]?.email_address,
            },
            { new: true, upsert: true } // Create if not found
        );

        console.log("User updated:", updatedUser);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
