import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

const Header = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <header className="header">
            <div className="container">
                <nav className="navbar">
                    <Link to="/" className="logo">SwiftServe</Link>

                    <ul className="nav-menu">
                        <li className="nav-item">
                            <Link to="/products" className="nav-link">Products</Link>
                        </li>

                        {isAuthenticated ? (
                            <li className="nav-item user-menu">
                                <span className="nav-link">{user?.name || 'Account'}</span>
                                <div className="user-dropdown">
                                    <button onClick={logout} className="dropdown-item">Logout</button>
                                </div>
                            </li>
                        ) : (
                            <>
                                <li className="nav-item">
                                    <Link to="/login" className="nav-link">Login</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/register" className="nav-link">Register</Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;