const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
    {
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },

        bookId: {
            type: String,
            required: true
        },

        bookTitle: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        borrowerId: {
            type: String,
            required: true,
            trim: true
        },

        borrowerName: {
            type: String,
            required: true,
            trim: true
        },

        issueTimestamp: {
            type: Date,
            required: true
        },

        returnTimestamp: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: ["ISSUED", "RETURNED"],
            default: "ISSUED"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Transaction", transactionSchema);