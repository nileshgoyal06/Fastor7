const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).send("Please login first!");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).lean();

    if (!user) throw new Error("User not found");

    if (user.status === "inactive") {
      return res.status(403).send("User is inactive");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { userAuth };