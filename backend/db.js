const mongoose = require("mongoose");
const url = process.env.MONGODB_URL.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

const connectDb = async function () {
  try {
    await mongoose.connect(url, {});
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error.message);
  }
};

module.exports = connectDb;
