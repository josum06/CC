const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const { Webhook } = require("svix");
const connectDb = require("./db");
const User = require("./models/User"); // ✅ Import User model
const ngrok = require("@ngrok/ngrok");
const cors = require("cors");
const userRouter = require("./routes/userRoute");
const adminRouter = require("./routes/adminPostRoute");
const app = express();
connectDb();

// ✅ Move webhook route above `express.json()`
app.use("/api/webhooks", express.raw({ type: "application/json" }));
app.use(express.json()); // ✅ Move this down

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend to access backend
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
  })
);
app.use("/api/user", userRouter);
app.use("/api/admin-post", adminRouter);

app.post(
  "/api/webhooks",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        console.error("Webhook secret not found.");
        return res.status(500).json({ error: "Server misconfiguration" });
      }

      const payload = req.body;
      const headers = req.headers;

      const svix = new Webhook(WEBHOOK_SECRET);
      let evt;

      try {
        evt = svix.verify(payload, headers);
      } catch (err) {
        console.error("Webhook verification failed:", err.message);
        return res.status(400).json({ error: "Webhook verification failed" });
      }

      console.log("Webhook Event Received:", evt);

      const eventType = evt.type;

      const { id, first_name, last_name, email_addresses,image_url} = evt.data;
      const email = email_addresses?.length
        ? email_addresses[0].email_address
        : null;

      if (!id) {
        console.error("User ID is missing in webhook event.");
        return res.status(400).json({ error: "Invalid webhook data" });
      }

      if (eventType === "user.deleted") {
        // 🔥 Delete user from MongoDB
        const deletedUser = await User.findOneAndDelete({ clerkId: id });
        if (deletedUser) {
          console.log("User deleted from MongoDB:", deletedUser);
        } else {
          console.log("User not found in MongoDB, skipping delete.");
        }
        return res.status(200).json({ message: "User deleted successfully" });
      }

      if (eventType === "user.created" || eventType === "user.updated") {
        // 🔄 Create or update user in MongoDB
        const updatedUser = await User.findOneAndUpdate(
          { clerkId: id },
          {
            fullName: `${first_name} ${last_name}`,
            email: email,
            profileImage: image_url,
          },
          { new: true, upsert: true }
        );

        console.log("User updated in MongoDB:", updatedUser);
        return res.status(200).json({ message: "User updated successfully" });
      }

      console.log(`Unhandled event type: ${eventType}`);
      return res.status(200).json({ message: "Event type ignored" });
    } catch (error) {
      console.error("Webhook error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

app.listen(3000, async function () {
  console.log("Server is running on port 3000");

  try {
    const listener = await ngrok.connect({
      addr: 3000,
      authtoken_from_env: true,
    });
    console.log(`Ngrok Tunnel: ${listener.url()}`); // ✅ Correctly extract the URL
  } catch (error) {
    console.error("Error starting Ngrok:", error);
  }
});
