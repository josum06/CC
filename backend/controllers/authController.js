exports.signUp = async (req, res) => {
  const { object } = req.body;

  if (object === "user") {
    const { id, email_addresses, first_name, last_name } = req.body;

    const newUser = new User({
      clerkId: id,
      fullName: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
    });

    try {
      await newUser.save();
      res.status(200).send("User saved successfully.");
    } catch (error) {
      res.status(500).send("Error saving user: " + error.message);
    }
  }
};
