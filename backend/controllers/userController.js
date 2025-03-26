const User = require("../models/User");
const imagekit = require("../imageKit");

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
      status
    } = req.body;

    let imageUrl = "";

    let updateData = {}; // Store only provided fields
    if (enrollmentNumber) updateData.enrollmentNumber = enrollmentNumber;
    if (githubUrl) updateData.githubUrl = githubUrl;
    if (linkedinUrl) updateData.linkedinUrl = linkedinUrl;
    if (aboutMe) updateData.aboutMe = aboutMe;
    if (skills) updateData.skills = JSON.parse(skills);

    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer, // File buffer from multer
        fileName: `${enrollmentNumber}_idcard.jpg`, // Unique filename
      });

      updateData.collegeIDCard = uploadedImage.url; // Store ImageKit URL
      updateData.status = true;
    }

    // Save user data in MongoDB
    const updatedUser = await User.findOneAndUpdate(
      { clerkId }, // Find by clerkId
      { $set: updateData }, // Update only provided fields
      { new: true } , // Return updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

getUserProfile = async (req, res) => {
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

module.exports = { uploadProfile, getUserProfile };
