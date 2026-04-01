const express = require("express");
const FinancialRecord = require("../models/FinancialRecord");
const { userAuth } = require("../middleware/auth");
const { roleAuth } = require("../middleware/role");

const dashboardRouter = express.Router();

// ================== SUMMARY ==================
dashboardRouter.get("/summary", userAuth, roleAuth("analyst", "admin"), async (req, res) => {
  try {
    const records = await FinancialRecord.find({
      createdBy: req.user._id,
    });

    let totalIncome = 0;
    let totalExpense = 0;

    records.forEach((r) => {
      if (r.type === "income") totalIncome += r.amount;
      else totalExpense += r.amount;
    });

    res.json({
      totalIncome,
      totalExpense,
      netBalance: totalIncome - totalExpense,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = dashboardRouter;