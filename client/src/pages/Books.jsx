import { useEffect, useState } from "react";
import QRCode from "qrcode";
import api from "../services/api";
import Navbar from "../components/Navbar";

function Books() {
    const [books, setBooks] = useState([]);
    const [form, setForm] = useState({
        bookId: "", title: "", author: "", isbn: "", category: "", totalCopies: 1
    });
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [availability, setAvailability] = useState("");
    const [message, setMessage] = useState("");

    const loadBooks = async () => {
        const res = await api.get("/books");
        setBooks(res.data);
    };

    useEffect(() => {
        loadBooks();
    }, []);

    const addBook = async e => {
        e.preventDefault();
        try {
            await api.post("/books", {
                ...form,
                totalCopies: Number(form.totalCopies)
            });
            setMessage("Book added successfully.");
            setForm({
                bookId: "", title: "", author: "", isbn: "", category: "", totalCopies: 1
            });
            loadBooks();
        } catch (error) {
            setMessage(error.response?.data?.message || "Failed to add book");
        }
    };

    const downloadQR = async id => {
        const url = await QRCode.toDataURL(id);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${id}-QR.png`;
        link.click();
    };

    const filtered = books.filter(book =>
        (book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase())) &&
        (!category || book.category.toLowerCase() === category.toLowerCase()) &&
        (!availability ||
        (availability === "available"
            ? book.availableCopies > 0
            : book.availableCopies === 0))
    );

    return (
        <>
            <Navbar />
            <main className="page">
                <h1>Manage Books</h1>
                <p>Add and view library books.</p>

                <section>
                    <h2>Add New Book</h2>
                    <form className="book-form" onSubmit={addBook}>
                        {Object.keys(form).map(field => (
                            <div className="form-group" key={field}>
                                <label>{field}</label>
                                <input
                                    type={field === "totalCopies" ? "number" : "text"}
                                    min={field === "totalCopies" ? 1 : undefined}
                                    value={form[field]}
                                    onChange={e =>
                                        setForm({ ...form, [field]: e.target.value })
                                    }
                                    required
                                />
                            </div>
                        ))}
                        <button>Add Book</button>
                    </form>
                    {message && <p>{message}</p>}
                </section>

                <section>
                    <h2>Library Books</h2>
                    <div className="filters">
                        <input
                            placeholder="Search title or author"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />

                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="">All Categories</option>
                            {[...new Set(books.map(book => book.category))].map(item => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>

                        <select value={availability} onChange={e => setAvailability(e.target.value)}>
                            <option value="">All Books</option>
                            <option value="available">Available</option>
                            <option value="issued">Issued</option>
                        </select>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Book ID</th><th>Title</th><th>Author</th>
                                <th>Category</th><th>Total</th><th>Available</th>
                                <th>Status</th><th>QR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(book => (
                                <tr key={book._id}>
                                    <td>{book.bookId}</td>
                                    <td>{book.title}</td>
                                    <td>{book.author}</td>
                                    <td>{book.category}</td>
                                    <td>{book.totalCopies}</td>
                                    <td>{book.availableCopies}</td>
                                    <td>{book.availableCopies > 0 ? "Available" : "Issued"}</td>
                                    <td>
                                        <button onClick={() => downloadQR(book.bookId)}>
                                            Download QR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </>
    );
}

export default Books;