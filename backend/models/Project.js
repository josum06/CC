const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: "String", required: true },
  description: { type: "String", required: true },
  projectUrl: { type: "String" },
  githubUrl: { type: "String" },
  TechStack: { type: Array },
  mediaUrl: { type: "String", required: true },
  contributors: { type: Array },
  likes: { type: "Number", default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  likedByUsers: { type: [String], default: [] },
},{
  timestamps: true,
});

module.exports = mongoose.model("Project", projectSchema);
