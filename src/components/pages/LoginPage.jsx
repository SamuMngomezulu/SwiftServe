import { useState, useEffect } from 'react';
import Login from '../auth/Login';
import Register from '../auth/Register';
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
        // Changed outer wrapper to auth-page-wrapper for consistency and clarity
        // while the internal card is still auth-container.
        <div className="auth-page-wrapper">
            <div className="auth-container"> {/* This is the existing .auth-container from AuthForm.css */}
                {isLogin ? (
                    <>
                        <Login />
                        <div className="auth-footer">
                            <button onClick={() => setIsLogin(false)} className="auth-toggle">
                                Need an account? Register
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <Register onRegisterSuccess={() => setIsLogin(true)} />
                        <div className="auth-footer">
                            <button onClick={() => setIsLogin(true)} className="auth-toggle">
                                Already have an account? Login
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default LoginPage;