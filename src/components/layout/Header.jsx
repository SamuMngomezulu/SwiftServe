import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="header">
            <div className="container">
                <nav className="navbar">
                    <Link to="/" className="logo">SwiftServe</Link>

                    {user && (
                        <ul className="nav-menu">
                            <li className="nav-item">
                                <Link to="/products" className="nav-link">Products</Link>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="dropdown-item">Logout</button>
                            </li>
                        </ul>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;