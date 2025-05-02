import { useState, useEffect } from 'react';
import Login from '../auth/Login';
import Register from '../auth/Register';
import '../auth/AuthForm.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';   

const LoginPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/products');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="page-container">
            {isLogin ? (
                <>
                    <Login />
                    <button onClick={() => setIsLogin(false)} className="auth-toggle">
                        Need an account? Register
                    </button>
                </>
            ) : (
                <>
                    <Register onRegisterSuccess={() => setIsLogin(true)} />
                    <button onClick={() => setIsLogin(true)} className="auth-toggle">
                        Already have an account? Login
                    </button>
                </>
            )}
        </div>
    );
};

export default LoginPage;
