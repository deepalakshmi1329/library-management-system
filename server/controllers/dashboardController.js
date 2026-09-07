const Book = require("../models/Book");
const Transaction = require("../models/Transaction");

const getDashboardStats = async (req, res) => {
    try {
        const books = await Book.find();

        const totalBooks = books.reduce((sum, book) => sum + book.totalCopies, 0);
        const availableBooks = books.reduce((sum, book) => sum + book.availableCopies, 0);
        const issuedBooks = totalBooks - availableBooks;

        const transactions = await Transaction.find({ status: "ISSUED" });

        const overdueBooks = transactions.filter(
            t => (new Date() - new Date(t.issueTimestamp)) / (1000 * 60 * 60 * 24) > 14
        );

        res.json({
            totalBooks,
            availableBooks,
            issuedBooks,
            overdueBooks: overdueBooks.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch dashboard statistics"
        });
    }
};

const getCurrentlyIssued = async (req, res) => {
    try {
        const transactions = await Transaction.find({
            status: "ISSUED"
        }).sort({ issueTimestamp: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch issued books"
        });
    }
};

module.exports = {
    getDashboardStats,
    getCurrentlyIssued
};