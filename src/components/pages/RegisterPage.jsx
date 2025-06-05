import Register from '../auth/Register';


const RegisterPage = () => {
    return (
        <div className="auth-page-wrapper"> {/* Renamed from .page-container */}
            <div className="auth-container"> {/* Added .auth-container wrapper for consistency with LoginPage */}
                <Register />
            </div>
        </div>
    );
};

export default RegisterPage;