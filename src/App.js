import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ROLE_KEYS } from './components/context/AuthContext';
import { CartProvider } from './components/context/CartContext';
import LoginPage from './components/pages/LoginPage';
import RegisterPage from './components/pages/RegisterPage';
import ProductList from './components/products/ProductList';
import ProductManagement from './components/products/ProductManagement';
import Layout from './components/layout/layout';
import RequireAuth from './components/auth/RequireAuth';
import './components/styles/styles.css';

function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Public product listing */}
                        <Route
                            path="/products"
                            element={
                                <Layout>
                                    <ProductList />
                                </Layout>
                            }
                        />

                        {/* Protected management routes */}
                        <Route
                            path="/product-management"
                            element={
                                <RequireAuth allowedRoles={[ROLE_KEYS.ADMIN, ROLE_KEYS.SUPER_USER]}>
                                    <Layout>
                                        <ProductManagement />
                                    </Layout>
                                </RequireAuth>
                            }
                        />
                    </Routes>
                </CartProvider>
            </AuthProvider>
        </Router>
    );
}

export default App;

