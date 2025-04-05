const mongoose = require("mongoose");
const commentProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const CommentProject = mongoose.model("CommentProject", commentProjectSchema);
