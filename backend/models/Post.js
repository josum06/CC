const mongoose = require("mongoose");


const postSchema = new mongoose.Schema(
  {
    caption: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
    likes: { type: Number, default: 0 },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Post", postSchema);
