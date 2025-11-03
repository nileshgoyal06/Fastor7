const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Define schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// ================== METHODS ==================

// Generate JWT
employeeSchema.methods.getJWT = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return token;
};

// Validate password
employeeSchema.methods.validatePassword = async function (passwordInputByUser) {
  const isMatch = await bcrypt.compare(passwordInputByUser, this.password);
  return isMatch;
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
