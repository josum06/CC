const mongoose = require("mongoose");
const adminPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type:  mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    category: {
      type: String,
      enum: ["Notice", "Event", "Placement"],
      required: true,
    },
    link: { type: String },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("AdminPost", adminPostSchema);
