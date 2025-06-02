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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WalletPage from './components/wallet/WalletPage';
import DepositPage from './components/wallet/DepositPage';
import OrderManagementPage from './components/pages/OrderManagementPage';
import MyOrdersPage from './components/pages/MyOrdersPage';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import OrderDetailsPage from './components/pages/OrderDetailsPage';



function App() {
    return (
        <Router>
            <AuthProvider>
                <CartProvider>
                    <Routes>
                        <Route path="/" element={<Navigate to="/login" />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/deposit" element={<DepositPage />} />
                        <Route path="/my-orders" element={<MyOrdersPage />} />
                        <Route path="/order-management" element={<OrderManagementPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                        <Route path="/orders/:orderId" element={<OrderDetailsPage />} />

                        {/* Public product listing */}
                        <Route
                            path="/products"
                            element={
                                <Layout>
                                    <ProductList />
                                    <ToastContainer position="top-right" autoClose={3000} />
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

