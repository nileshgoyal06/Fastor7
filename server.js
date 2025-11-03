const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();

app.use(express.json()); 
app.use(cookieParser()); 


const authRouter = require("./routes/auth");
const enquiryRouter = require("./routes/enquiry");

app.use("/", authRouter);
app.use("/", enquiryRouter);


connectDB()
  .then(() => {
    console.log("✅ Database connected successfully");
    app.listen(process.env.PORT || 7777, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 7777}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
  });
