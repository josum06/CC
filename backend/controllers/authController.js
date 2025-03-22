const User = require("../models/User");

exports.signUp = async (req, res) => {
  try {
    const { clerkId, firstName, lastName, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Check if user already exists
    console.log("User checking...");
    let user = await User.findOne({ clerkId });
    console.log("User checked.");
   
    if (!user) {
      user = new User({
        clerkId,
        fullName: `${firstName} ${lastName}`,
        email,
      });
      
      console.log(user);
      console.log("Saving user...");
      await user.save();
      console.log("User saved successfully");
      return res.status(201).json({ message: "User saved successfully" });
    }

    res.status(200).json({ message: "User already exists" });
  } catch (error) {
    res.status(500).json({ error: "Server error: " + error.message });
  }
};
