const Post = require("../models/Post");
const imagekit = require("../imageKit");
const fs = require("fs");


exports.createPost = async (req, res) => {
  try {
    const { author,caption } = req.body;
    let mediaUrl = null;
   
    if (!req.file) {
      return res.status(400).json({ message: "Missing file parameter for upload" });
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


exports.getPosts = async (req,res)=>{
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

    console.log("Fetched posts",post);
    res.json({ post });
  } catch (error) {
    console.error("Error fetching notices:", error);
    res.status(500).json({ message: "Server error" });
  }
}