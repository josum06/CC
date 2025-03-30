const AdminPost = require("../models/AdminPost");
const imagekit = require("../imageKit");
exports.createPost = async (req, res) => {
  try {
    const { title, content, author, category, link } = req.body;
    let imageUrl = null;

    if (req.file) {
      // Check if an image file is uploaded
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer, // File buffer from multer
        fileName: req.file.originalname, // Use the original file name
        folder: "/admin-posts", // Optional: Store images in a specific folder
      });
      imageUrl = uploadedImage.url;
    }
    const post = new AdminPost({
      title,
      content,
      author,
      category,
      imageUrl,
      link: link || null,
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
