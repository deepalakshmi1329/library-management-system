const Book = require("../models/Book");
const Transaction = require("../models/Transaction");
const { Parser } = require("json2csv");

const issueBook = async (req, res) => {
    try {
        const { bookId, borrowerId, borrowerName } = req.body;

        if (!bookId || !borrowerId || !borrowerName)
            return res.status(400).json({ message: "All issue details are required" });

        const book = await Book.findOne({ bookId: bookId.trim() });

        if (!book)
            return res.status(404).json({ message: "Invalid book ID" });

        if (book.availableCopies <= 0)
            return res.status(400).json({ message: "Book is currently unavailable" });

        const transaction = await Transaction.create({
            book: book._id,
            bookId: book.bookId,
            bookTitle: book.title,
            author: book.author,
            borrowerId,
            borrowerName,
            issueTimestamp: new Date(),
            status: "ISSUED"
        });

        book.availableCopies--;
        await book.save();

        res.status(201).json({
            message: "Book issued successfully",
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to issue book" });
    }
};

const returnBook = async (req, res) => {
    try {
        const { bookId } = req.body;

        if (!bookId)
            return res.status(400).json({ message: "Book ID is required" });

        const book = await Book.findOne({ bookId: bookId.trim() });

        if (!book)
            return res.status(404).json({ message: "Invalid book ID" });

        const transaction = await Transaction.findOne({
            bookId,
            status: "ISSUED"
        }).sort({ issueTimestamp: -1 });

        if (!transaction)
            return res.status(400).json({ message: "This book is not currently issued" });

        transaction.returnTimestamp = new Date();
        transaction.status = "RETURNED";
        await transaction.save();

        if (book.availableCopies < book.totalCopies)
            book.availableCopies++;

        await book.save();

        res.json({
            message: "Book returned successfully",
            transaction
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to return book" });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ issueTimestamp: -1 });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch transactions" });
    }
};

const exportTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .sort({ issueTimestamp: -1 });

        const data = transactions.map(t => ({
            "Book Title": t.bookTitle,
            "Author": t.author,
            "Book ID": t.bookId,
            "Issued To": `${t.borrowerId} - ${t.borrowerName}`,
            "Issue Timestamp": t.issueTimestamp,
            "Return Timestamp": t.returnTimestamp || "",
            "Current Status": t.status
        }));

        const fields = [
            "Book Title",
            "Author",
            "Book ID",
            "Issued To",
            "Issue Timestamp",
            "Return Timestamp",
            "Current Status"
        ];

        const csv = new Parser({ fields }).parse(data);

        res.header("Content-Type", "text/csv");
        res.attachment("library-transactions.csv");
        res.send(csv);
    } catch (error) {
        res.status(500).json({ message: "Failed to export transactions" });
    }
};

module.exports = {
    issueBook,
    returnBook,
    getTransactions,
    exportTransactions
};