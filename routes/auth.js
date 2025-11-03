const express = require("express");
const bcrypt = require("bcrypt");
const Employee = require("../models/Employee");
const { userAuth } = require("../middleware/auth");

const authRouter = express.Router();

// ================== REGISTER ==================
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new Error("Please fill all required fields");
    }

    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = new Employee({
      name,
      email,
      password: hashedPassword,
    });

    const savedEmployee = await newEmployee.save();
    const token = await savedEmployee.getJWT();

    res.cookie("token", token);
    res.json({
      message: "Employee registered successfully!",
      data: savedEmployee,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// ================== LOGIN ==================
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await employee.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Incorrect password");
    }

    const token = await employee.getJWT();
    res.cookie("token", token);
    res.json({
      message: "Login successful!",
      data: employee,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// ================== LOGOUT ==================
authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) throw new Error("User not found");

    res.clearCookie("token");
    res.send("Logout successful by: " + user.name);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;
