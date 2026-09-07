import { useEffect, useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const loadTransactions = async () => {
            const response = await api.get("/transactions");
            setTransactions(response.data);
        };

        loadTransactions();
    }, []);

    const downloadCSV = async () => {
        const response = await api.get("/transactions/export", {
            responseType: "blob"
        });

        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");

        link.href = url;
        link.download = "transactions.csv";
        link.click();

        window.URL.revokeObjectURL(url);
    };

    const filtered = transactions.filter(t =>
        (t.bookTitle.toLowerCase().includes(search.toLowerCase()) ||
        t.bookId.toLowerCase().includes(search.toLowerCase()) ||
        t.borrowerName.toLowerCase().includes(search.toLowerCase())) &&
        (!status || t.status === status)
    );

    return (
        <>
            <Navbar />

            <main className="page">
                <h1>Transaction History</h1>
                <p>View and filter all book issue and return records.</p>

                <button onClick={downloadCSV}>Export CSV</button>

                <div className="filters">
                    <input
                        placeholder="Search book or borrower"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />

                    <select value={status} onChange={e => setStatus(e.target.value)}>
                        <option value="">All Status</option>
                        <option value="ISSUED">Issued</option>
                        <option value="RETURNED">Returned</option>
                    </select>
                </div>

                <section>
                    <table>
                        <thead>
                            <tr>
                                <th>Book</th>
                                <th>Book ID</th>
                                <th>Borrower</th>
                                <th>Issue Date</th>
                                <th>Return Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {filtered.map(t => (
                                <tr key={t._id}>
                                    <td>{t.bookTitle}</td>
                                    <td>{t.bookId}</td>
                                    <td>{t.borrowerName}</td>
                                    <td>{new Date(t.issueTimestamp).toLocaleDateString()}</td>
                                    <td>
                                        {t.returnTimestamp
                                            ? new Date(t.returnTimestamp).toLocaleDateString()
                                            : "-"}
                                    </td>
                                    <td>{t.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    );
}

export default Transactions;