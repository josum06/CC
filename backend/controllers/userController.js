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
      personalUrl,
    } = req.body;

    let updateData = {}; // Store only provided fields
    if (enrollmentNumber) updateData.enrollmentNumber = enrollmentNumber;
    if (githubUrl) updateData.githubUrl = githubUrl;
    if (linkedinUrl) updateData.linkedinUrl = linkedinUrl;
    if (aboutMe) updateData.aboutMe = aboutMe;
    if (skills) updateData.skills = JSON.parse(skills);
    if (designation) updateData.designation = designation;
    if (collegeId) updateData.collegeId = collegeId;
    if (personalUrl) updateData.personalUrl = personalUrl;

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

    // Calculate department from enrollment number
    let department = null;
    if (user.enrollmentNumber) {
      const branchCode = user.enrollmentNumber.substring(6, 9);
      switch (branchCode) {
        case "027":
          department = "Computer Science Engineering";
          break;
        case "031":
          department = "Information Technology";
          break;
        case "119":
          department = "Artificial Intelligence and Data Science";
          break;
        case "049":
          department = "Electrical Engineering";
          break;
        case "028":
          department = "Electronics and Communication Engineering";
          break;
        case "157":
          department = "Computer Science Engineering in Data Science";
          break;
        default:
          department = "Unknown Department";
      }
    }

    // Add department to the user object
    const userWithDepartment = {
      ...user.toObject(),
      department: department
    };

    res.status(200).json(userWithDepartment);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Calculate department from enrollment number
    let department = null;
    if (user.enrollmentNumber) {
      const branchCode = user.enrollmentNumber.substring(6, 9);
      switch (branchCode) {
        case "027":
          department = "Computer Science Engineering";
          break;
        case "031":
          department = "Information Technology";
          break;
        case "119":
          department = "Artificial Intelligence and Data Science";
          break;
        case "049":
          department = "Electrical Engineering";
          break;
        case "028":
          department = "Electronics and Communication Engineering";
          break;
        case "157":
          department = "Computer Science Engineering in Data Science";
          break;
        default:
          department = "Unknown Department";
      }
    }

    // Add department to the user object
    const userWithDepartment = {
      ...user.toObject(),
      department: department
    };

    res.status(200).json(userWithDepartment);
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
    const { query, clerkId } = req.query;
    // Search for users by name or email

    const allUsers = await User.find({
      fullName: { $regex: query, $options: "i" },
    });
    const users = allUsers.filter((user) => {
      if (user.clerkId === clerkId) {
        return false; // Exclude the current user from the search results
      }
      return true; // Include other users
    });
    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateConnectionsPending = async (req, res) => {
  try {
    const { userId } = req.params;
    const { receiverId } = req.body;
    const user1 = await User.findById(userId);
    if (user1.connections.includes(receiverId)) {
      return res.status(400).json({ message: "Already connected" });
    }
    const user2 = await User.findById(receiverId);
    if (user2.connections.includes(userId)) {
      return res.status(400).json({ message: "Already connected" });
    }
    if (user1.connectionsPending.includes(receiverId)) {
      return res.status(400).json({
        message: `${user1.fullName || "User"} has sent you a request`,
      });
    }
    const senderId = userId;
    // jo receiver ki id hai use hme connectionsAwaited(sender) me dalna hai
    const sender = await User.findByIdAndUpdate(
      senderId,
      { $addToSet: { connectionsAwaited: receiverId } },
      { new: true }
    );

    // or jo sender ki id hai use hme connectionsPending(receiver) me dalna hai
    const receiver = await User.findByIdAndUpdate(
      receiverId,
      { $addToSet: { connectionsPending: senderId } },
      { new: true }
    );

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }
    
    
    res.status(200).json({
      message: "Connection request sent successfully",
    });
  } catch (error) {
    console.error("Error updating connections pending:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPendingConnections = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user from DB using Clerk ID
    const user = await User.findById(userId).populate({
      path: "connectionsPending",
      select: "fullName profileImage", // Select only these fields
    });


    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.connectionsPending);
  } catch (error) {
    console.error("Error fetching pending connections:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const connectionAccepted = async (req, res) => {
  try {
    const { userId } = req.params; // logged in user ki id. // vbhv
    const { senderId } = req.body; //  jo req bhej rha hai.    // sumit

    // jo sender ki id hai use hme connectionsAccepted(sender) me dalna hai
    const receiver = await User.findByIdAndUpdate(
      userId,
      {
        $pull: { connectionsPending: senderId },
        $addToSet: { connections: senderId },
      },
      { new: true }
    );

    // or jo receiver ki id hai use hme connectionsPending(receiver) se hata dena hai
    const sender = await User.findByIdAndUpdate(
      senderId,
      {
        $pull: { connectionsAwaited: userId },
        $addToSet: { connections: userId },
      },
      { new: true }
    );

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Connection request accepted successfully",
    });
  } catch (error) {
    console.error("Error updating connections pending:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const connectionRejected = async (req, res) => {
  try {
    const { userId } = req.params; // logged in user ki id.  // vbhv
    const { senderId } = req.body; //  jo req bhej rha hai.    // sumit

    // jo sender ki id hai use hme connectionsAccepted(sender) me dalna hai

    const receiver = await User.findByIdAndUpdate(
      userId,
      { $pull: { connectionsPending: senderId } },
      { new: true }
    );

    // or jo receiver ki id hai use hme connectionsPending(receiver) se hata dena hai
    const sender = await User.findByIdAndUpdate(
      senderId,
      { $pull: { connectionsAwaited: userId } },
      { new: true }
    );

    if (!sender || !receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Connection request rejected successfully",
    });
  } catch (error) {
    console.error("Error updating connections pending:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getCurrentConnections = async (req, res) => {
  try {
    const { userId } = req.params;
    const { receiverId } = req.query;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ category: "rejected" });
    }

    if (user.connections.includes(receiverId)) {
      return res.status(200).json({ category: "accepted" });
    }

    if (user.connectionsAwaited.includes(receiverId)) {
      return res.status(200).json({ category: "pending" });
    }

    return res.status(200).json({ category: "rejected" });
  } catch (error) {
    console.error("Error checking connection status:", error);
    return res.status(500).json({ category: "rejected" });
  }
};

const getUserConnections = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "connections",
      "fullName profileImage"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user.connections);
  } catch (error) {
    console.error("Error fetching user connections:", error);
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
  updateConnectionsPending,
  getPendingConnections,
  connectionAccepted,
  connectionRejected,
  getCurrentConnections,
  getUserConnections,
};
