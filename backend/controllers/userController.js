const User = require("../models/User");
const imagekit = require("../imageKit");
const Post = require("../models/Post");
// Function to handle profile upload
const uploadProfile = async (req, res) => {
  try {
    const {
      clerkId,
      enrollmentNumber,
      githubUrl,
      linkedinUrl,
      skills,
      aboutMe,
      designation,
      collegeId,
    } = req.body;

    let updateData = {}; // Store only provided fields
    if (enrollmentNumber) updateData.enrollmentNumber = enrollmentNumber;
    if (githubUrl) updateData.githubUrl = githubUrl;
    if (linkedinUrl) updateData.linkedinUrl = linkedinUrl;
    if (aboutMe) updateData.aboutMe = aboutMe;
    if (skills) updateData.skills = JSON.parse(skills);
    if (designation) updateData.designation = designation;
    if (collegeId) updateData.collegeId = collegeId;

    // Assign role based on designation
    if (designation) {
      if (["principal", "dean"].includes(designation.toLowerCase())) {
        updateData.role = "admin";
      } else if (
        ["teacher", "faculty", "hod"].includes(designation.toLowerCase())
      ) {
        updateData.role = "faculty";
      }
    }

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer, // File buffer from multer
        fileName: `${enrollmentNumber || collegeId}_idcard.jpg`, // Unique filename
      });

      updateData.collegeIDCard = uploadedImage.url; // Store ImageKit URL
      updateData.status = true;
    }

    // Save user data in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { clerkId }, // Find by clerkId
      { $set: updateData }, // Update only provided fields
      { new: true } // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    if (updatedUser.enrollmentNumber && updatedUser.collegeIDCard) {
      updatedUser.profileComplete = true;
      await updatedUser.save();
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { clerkId } = req.params;

    // Fetch user from DB using Clerk ID
    const user = await User.findOne({ clerkId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPostsById = async (req, res) => {
  try {
    const userId = req.params.userId;
    const posts = await Post.find({ author: userId });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find(); // Exclude password field
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const searchUser = async (req, res) => {
  try {
    const { query } = req.query;
    // Search for users by name or email
    const users = await User.find({
      fullName: { $regex: query, $options: "i" },
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  uploadProfile,
  getUserProfile,
  getUserProfileById,
  getPostsById,
  getAllUsers,
  searchUser,
};
