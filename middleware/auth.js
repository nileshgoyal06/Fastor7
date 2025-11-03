const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // read token from cookies
    if (!token) {
      return res.status(401).send("Please login first!");
    }

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // find employee by decoded _id
    const employee = await Employee.findById(decoded._id).lean(); // convert to plain JS object
    if (!employee) {
      throw new Error("Employee not found");
    }

    req.user = employee; // attach employee to request
    next(); // continue
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { userAuth };
