const Book = require("../models/Book");

const createBook = async (req, res) => {
    try {
        const { bookId, title, author, isbn, category, totalCopies } = req.body;

        if (!bookId || !title || !author || !isbn || !category || totalCopies === undefined)
            return res.status(400).json({ message: "All book fields are required" });

        if (Number(totalCopies) < 1)
            return res.status(400).json({ message: "Total copies must be at least 1" });

        const existing = await Book.findOne({
            $or: [{ bookId }, { isbn }]
        });

        if (existing)
            return res.status(409).json({ message: "Book ID or ISBN already exists" });

        const book = await Book.create({
            bookId,
            title,
            author,
            isbn,
            category,
            totalCopies: Number(totalCopies),
            availableCopies: Number(totalCopies)
        });

        res.status(201).json({
            message: "Book created successfully",
            book
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to create book" });
    }
};

const getBooks = async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch books" });
    }
};

const getBookById = async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: req.params.id });

        if (!book)
            return res.status(404).json({ message: "Book not found" });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch book" });
    }
};

const updateBook = async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: req.params.id });

        if (!book)
            return res.status(404).json({ message: "Book not found" });

        const { title, author, isbn, category, totalCopies } = req.body;

        if (!title || !author || !isbn || !category || totalCopies === undefined)
            return res.status(400).json({ message: "All book fields are required" });

        const issued = book.totalCopies - book.availableCopies;

        if (Number(totalCopies) < issued)
            return res.status(400).json({
                message: "Total copies cannot be less than issued copies"
            });

        const duplicate = await Book.findOne({
            isbn,
            _id: { $ne: book._id }
        });

        if (duplicate)
            return res.status(409).json({ message: "ISBN already exists" });

        book.title = title;
        book.author = author;
        book.isbn = isbn;
        book.category = category;
        book.totalCopies = Number(totalCopies);
        book.availableCopies = Number(totalCopies) - issued;

        await book.save();

        res.json({
            message: "Book updated successfully",
            book
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to update book" });
    }
};

const deleteBook = async (req, res) => {
    try {
        const book = await Book.findOne({ bookId: req.params.id });

        if (!book)
            return res.status(404).json({ message: "Book not found" });

        if (book.availableCopies !== book.totalCopies)
            return res.status(400).json({
                message: "Cannot delete a book while copies are issued"
            });

        await Book.deleteOne({ _id: book._id });

        res.json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete book" });
    }
};

module.exports = {
    createBook,
    getBooks,
    getBookById,
    updateBook,
    deleteBook
};