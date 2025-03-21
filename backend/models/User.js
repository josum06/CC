const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, required: true, unique: true },
  enrollmentNumber: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
