const Post = require("../models/Post");
const imagekit = require("../imageKit");
const fs = require("fs");
const Comment = require("../models/Comment");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const { author, caption } = req.body;
    let mediaUrl = null;

    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Missing file parameter for upload" });
    }

    if (req.file) {
      const filePath = req.file.path; // Get the file path

      // Read the file from disk
      const fileBuffer = fs.readFileSync(filePath);

      // Check if an image file is uploaded
      const uploadedImage = await imagekit.upload({
        file: fileBuffer, // File buffer from multer
        fileName: req.file.originalname, // Use the original file name
        folder: "/user-posts", // Optional: Store images in a specific folder
      });
      mediaUrl = uploadedImage.url;
    }
    const post = new Post({
      caption,
      author,
      mediaUrl,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = 10; // Fetch 10 notices per request
    const skip = (page - 1) * limit;

    // Fetch notices with pagination (latest first)
    const post = await Post.find()
      .populate("author", "fullName  profileImage ")
      .sort({ createdAt: -1 }) // Sort by latest
      .skip(skip)
      .limit(limit);

    res.json({ post });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { text, postId, userId } = req.body;
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create new comment in Comment model
    const newComment = new Comment({ text, postId, userId });
    await newComment.save();

    // Push the new comment's ID into the Post model's comments array
    post.comments.push(newComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: "Comment added successfully", comment: newComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ message: "Missing postId parameter" });
    }
    const comments = await Comment.find({ postId, isReply: false })
      .populate("userId", "fullName profileImage")
      .sort({ createdAt: -1 });
    res.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body; // Get user ID from request


    if (!postId || !userId) {
      return res.status(400).json({ message: "Missing postId or userId" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const hasLiked = post.likedByUsers.includes(userId);

    if (hasLiked) {
      // If user has already liked, remove like
      post.likes -= 1;
      post.likedByUsers = post.likedByUsers.filter((id) => id !== userId);
    } else {
      // If user has not liked, add like
      post.likes += 1;
      post.likedByUsers.push(userId);
    }

    await post.save();

    res.json({
      message: hasLiked ? "Like removed" : "Post liked",
      post,
      hasLiked: !hasLiked, // Send new like status
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getLikedUser = async (req, res) => {
  try {
    const postId = req.params.postId;
    if (!postId) {
      return res.status(400).json({ message: "Missing postId parameter" });
    }
    const post = await Post.findById(postId).populate("likedByUsers");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ likedByUsers: post.likedByUsers });
  } catch (error) {
    console.error("Error fetching liked users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.replyComment = async (req, res) => {
  try {
    const { commentId, text, clerkId } = req.body;
    if (!commentId || !text || !clerkId) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userId = user._id;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Create new reply
    const newReply = new Comment({
      text,
      userId,
      postId: comment.postId,
      isReply: true,
    });
    await newReply.save();

    // Push the new reply's ID into the parent comment's replies array
    comment.replies.push(newReply._id);
    await comment.save();

    res.status(201).json({
      message: "Reply added successfully",
      reply: newReply,
    });
  } catch (error) {
    console.error("Error replying to comment:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
