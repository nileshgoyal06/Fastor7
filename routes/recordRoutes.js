const express = require("express");
const FinancialRecord = require("../models/FinancialRecord");
const { userAuth } = require("../middleware/auth");
const { roleAuth } = require("../middleware/role");

const recordRouter = express.Router();

// ================== CREATE ==================
recordRouter.post("/create", userAuth, roleAuth("admin"), async (req, res) => {
  try {
    const record = await FinancialRecord.create({
      ...req.body,
      createdBy: req.user._id,
    });

    res.json({
      message: "Record created",
      data: record,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// ================== GET ==================
recordRouter.get("/", userAuth, roleAuth("viewer", "analyst", "admin"), async (req, res) => {
  try {
    const records = await FinancialRecord.find({
      createdBy: req.user._id,
    });

    res.json({
      message: "Records fetched",
      data: records,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// ================== UPDATE ==================
recordRouter.put("/:id", userAuth, roleAuth("admin"), async (req, res) => {
  try {
    const updated = await FinancialRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Record updated",
      data: updated,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// ================== DELETE ==================
recordRouter.delete("/:id", userAuth, roleAuth("admin"), async (req, res) => {
  try {
    await FinancialRecord.findByIdAndDelete(req.params.id);

    res.send("Record deleted");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = recordRouter;