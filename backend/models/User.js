const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  clerkUserId: { type: String, unique: true },
  enrollmentNumber: { type: String, unique: true },
  role: {
    type: String,
    enums: ["admin", "faculty", "student"],
    default: "student",
  },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
});

module.exports = mongoose.model("User", UserSchema);
