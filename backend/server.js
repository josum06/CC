const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const connectDb = require("./db");
const authRouter = require('./routes/authRoutes');
const app = express();
connectDb();
app.use(express.json());
// await connectDb();


app.use('/api',authRouter);

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

