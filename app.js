const express = require("express");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(cookieParser());

// ================== ROUTES ==================
const authRouter = require("./routes/authRoutes");
const recordRouter = require("./routes/recordRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");

app.use("/api/auth", authRouter);
app.use("/api/records", recordRouter);
app.use("/api/dashboard", dashboardRouter);

// ================== DB ==================
connectDB()
  .then(() => {
    console.log("DB connected");

    app.listen(process.env.PORT || 7777, () => {
      console.log("Server running");
    });
  })
  .catch((err) => {
    console.log(err.message);
  });