const express = require("express");

const {
    issueBook,
    returnBook,
    getTransactions,
    exportTransactions
} = require("../controllers/transactionController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/issue", issueBook);
router.post("/return", returnBook);
router.get("/", getTransactions);
router.get("/export", exportTransactions);

module.exports = router;