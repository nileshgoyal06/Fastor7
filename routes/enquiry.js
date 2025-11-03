const express = require("express");
const Enquiry = require("../models/Enquiry");
const { userAuth } = require("../middleware/auth");

const enquiryRouter = express.Router();

// ================== PUBLIC FORM (No Auth) ==================
enquiryRouter.post("/public", async (req, res) => {
  try {
    const { name, email, courseInterest } = req.body;

    if (!name || !email || !courseInterest) {
      throw new Error("Please fill all fields");
    }

    const enquiry = new Enquiry({
      name,
      email,
      courseInterest,
    });

    const savedEnquiry = await enquiry.save();
    res.json({
      message: "Enquiry submitted successfully!",
      data: savedEnquiry,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// ================== FETCH UNCLAIMED ENQUIRIES ==================
enquiryRouter.get("/public", userAuth, async (req, res) => {
  try {
    const unclaimedEnquiries = await Enquiry.find({ claimedBy: null });
    res.json(unclaimedEnquiries);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// ================== CLAIM ENQUIRY ==================
enquiryRouter.post("/claim/:id", userAuth, async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) throw new Error("Enquiry not found");
    if (enquiry.claimedBy) throw new Error("Already claimed by someone else");

    enquiry.claimedBy = req.user._id;
    const updated = await enquiry.save();

    res.json({
      message: "Enquiry claimed successfully!",
      data: updated,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// ================== FETCH CLAIMED ENQUIRIES ==================
enquiryRouter.get("/my", userAuth, async (req, res) => {
  try {
    const myEnquiries = await Enquiry.find({ claimedBy: req.user._id });
    res.json(myEnquiries);
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = enquiryRouter;
