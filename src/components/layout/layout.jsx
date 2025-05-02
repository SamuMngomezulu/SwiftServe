import { useAuth } from '../context/AuthContext';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';  

const Layout = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return (
        <>
            <Header />
            <main className="main-content">
                {children}
            </main>
        </>
    );
};

export default Layout;