import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Dashboard() {
    const [stats, setStats] = useState({});
    const [issuedBooks, setIssuedBooks] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const statsRes = await api.get("/dashboard/stats");
                const issuedRes = await api.get("/dashboard/issued");

                setStats(statsRes.data);
                setIssuedBooks(issuedRes.data);
            } catch (error) {
                console.error("Failed to load dashboard");
            }
        };

        loadDashboard();
    }, []);

    return (
        <>
            <Navbar />

            <main className="page">
                <h1>Library Dashboard</h1>
                <p>View and manage the current library status.</p>

                <section className="stats">
                    <div className="stat-card">
                        <h3>Total Books</h3>
                        <p>{stats.totalBooks || 0}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Available Books</h3>
                        <p>{stats.availableBooks || 0}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Issued Books</h3>
                        <p>{stats.issuedBooks || 0}</p>
                    </div>

                    <div className="stat-card">
                        <h3>Overdue Books</h3>
                        <p>{stats.overdueBooks || 0}</p>
                    </div>
                </section>

                <section>
                    <h2>Quick Actions</h2>

                    <div className="action-buttons">
                        <Link to="/books" className="action-button">
                            Manage Books
                        </Link>

                        <Link to="/scan" className="action-button">
                            Issue / Return
                        </Link>

                        <Link to="/transactions" className="action-button">
                            Transaction History
                        </Link>
                    </div>
                </section>

                <section>
                    <h2>Currently Issued Books</h2>

                    {issuedBooks.length === 0 ? (
                        <p>No books are currently issued.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Book</th>
                                    <th>Book ID</th>
                                    <th>Borrower</th>
                                    <th>Issue Date</th>
                                </tr>
                            </thead>

                            <tbody>
                                {issuedBooks.map((book) => (
                                    <tr key={book._id}>
                                        <td>{book.bookTitle}</td>
                                        <td>{book.bookId}</td>
                                        <td>{book.borrowerName}</td>
                                        <td>
                                            {new Date(
                                                book.issueTimestamp
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </main>
        </>
    );
}

export default Dashboard;