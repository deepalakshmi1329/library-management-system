import {
    Link,
    useNavigate
} from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <div className="navbar-title">
                Library Management System
            </div>

            <div className="navbar-links">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/books">
                    Manage Books
                </Link>

                <Link to="/scan">
                    Issue / Return
                </Link>

                <Link to="/transactions">
                    Transaction History
                </Link>

                <button
                    className="logout-button"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;