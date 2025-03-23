const express = require("express");
const { ClerkExpressWithAuth, users } = require("@clerk/clerk-sdk-node");
const User = require("../models/User.js"); // Mongoose model
const authController = require("../controllers/authController.js");
const router = express.Router();

router.post("/save-user", authController.signUp);
router.post("/clerk-webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
        const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET; // Store in .env file

        const headers = req.headers;
        const payload = req.body;

        if (!WEBHOOK_SECRET) {
            console.error("Webhook secret not found.");
            return res.status(500).json({ error: "Server misconfiguration" });
        }

        const wh = new Webhook(WEBHOOK_SECRET);
        let evt;

        try {
            evt = wh.verify(payload, headers);
        } catch (err) {
            console.error("Webhook verification failed:", err.message);
            return res.status(400).json({ error: "Webhook verification failed" });
        }

        const { id, first_name, last_name, email_addresses } = evt.data;

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
            { new: true, upsert: true }
        );

        console.log("User updated:", updatedUser);
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        console.error("Webhook error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
