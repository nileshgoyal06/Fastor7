const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const { userAuth } = require("../middleware/auth");

const authRouter = express.Router();

// ================== REGISTER ==================
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      throw new Error("Missing fields");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    const token = user.getJWT();
    res.cookie("token", token);

    res.json({
      message: "Registered successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// ================== LOGIN ==================
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    const token = user.getJWT();
    res.cookie("token", token);

    res.json({
      message: "Login successful",
      data: user,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// ================== LOGOUT ==================
authRouter.post("/logout", userAuth, (req, res) => {
  res.clearCookie("token");
  res.send("Logout successful");
});

module.exports = authRouter;