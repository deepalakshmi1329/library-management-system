const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const transactionRoutes =
    require("./routes/transactionRoutes");
const dashboardRoutes =
    require("./routes/dashboardRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/books", bookRoutes);

app.use(
    "/api/transactions",
    transactionRoutes
);

app.use(
    "/api/dashboard",
    dashboardRoutes
);

app.get("/", (req, res) => {
    res.json({
        message: "Library Management API is running"
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});