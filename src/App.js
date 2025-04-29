import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProductListPage from './components/pages/ProductListPage';



function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/products" element={<ProductListPage />} />

                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;