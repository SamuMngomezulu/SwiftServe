// Layout.jsx
import { useAuth } from '../context/AuthContext';
import Sidebar from '../products/Sidebar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/layout.css';


const Layout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="app-container">
            <Sidebar className={sidebarOpen ? 'open' : ''} />
            <main className="main-content">
                <button
                    className="mobile-menu-btn"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                >
                    ☰
                </button>
                {children}
            </main>
        </div>
    );
};

export default Layout;