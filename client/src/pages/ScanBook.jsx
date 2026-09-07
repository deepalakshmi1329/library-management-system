import { useCallback, useState } from "react";
import QRScanner from "../components/QRScanner";
import api from "../services/api";
import Navbar from "../components/Navbar";

function ScanBook() {
    const [bookId, setBookId] = useState("");
    const [borrowerId, setBorrowerId] = useState("");
    const [borrowerName, setBorrowerName] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleScan = useCallback((id) => {
        setBookId(id);
        setMessage(`Scanned Book ID: ${id}`);
        setError("");
    }, []);

    const issueBook = async () => {
        try {
            setError("");
            const response = await api.post("/transactions/issue", {
                bookId, borrowerId, borrowerName
            });
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to issue book");
        }
    };

    const returnBook = async () => {
        try {
            setError("");
            const response = await api.post("/transactions/return", { bookId });
            setMessage(response.data.message);
        } catch (error) {
            setError(error.response?.data?.message || "Failed to return book");
        }
    };

    return (
        <>
            <Navbar />
            <main className="page">
                <h1>Issue / Return Book</h1>
                <p>Scan the QR code or enter the Book ID manually.</p>

                <QRScanner onScan={handleScan} />

                <div className="form-group">
                    <label>Book ID</label>
                    <input
                        value={bookId}
                        onChange={e => setBookId(e.target.value)}
                        placeholder="Book ID"
                    />
                </div>

                <div className="form-group">
                    <label>Borrower ID</label>
                    <input
                        value={borrowerId}
                        onChange={e => setBorrowerId(e.target.value)}
                        placeholder="Student ID"
                    />
                </div>

                <div className="form-group">
                    <label>Borrower Name</label>
                    <input
                        value={borrowerName}
                        onChange={e => setBorrowerName(e.target.value)}
                        placeholder="Student Name"
                    />
                </div>

                <button onClick={issueBook}>Issue Book</button>
                <button onClick={returnBook}>Return Book</button>

                {message && <p>{message}</p>}
                {error && <p className="error">{error}</p>}
            </main>
        </>
    );
}

export default ScanBook;