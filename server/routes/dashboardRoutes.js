const express = require("express");

const {
    getDashboardStats,
    getCurrentlyIssued
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/stats", getDashboardStats);
router.get("/issued", getCurrentlyIssued);

module.exports = router;