const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config({ path: "./config.env" });
const connectDb = require("./db");
const authRouter = require('./routes/authRoutes');
const cors = require("cors");
const app = express();
connectDb();
app.use(express.json());
// await connectDb();

app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend to access backend
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

app.use("/clerk-webhook", bodyParser.raw({ type: "application/json" }));
app.use('/api/auth',authRouter);

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});

