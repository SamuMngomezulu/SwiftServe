import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/context/AuthContext';
import { CartProvider } from './components/context/CartContext';
import Header from './components/layout/Header';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProductListPage from './components/pages/ProductListPage';
import CartButton from './components/cart/CartButton';
import CartModal from './components/cart/CartModal';
import './components/styles/styles.css';



function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Header />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<ProductListPage />} />
                            <Route path="/products" element={<ProductListPage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                          

                        </Routes>
                    </main>
                    <CartButton />
                    <CartModal />
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;