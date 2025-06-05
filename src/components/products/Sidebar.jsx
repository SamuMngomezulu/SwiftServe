import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import WalletBalance from '../wallet/WalletBalance';

const Sidebar = () => {
    const { user, hasRole, ROLE_KEYS, logout } = useAuth();
    const location = useLocation();

    const isActive = (path) => {
        return location.pathname.startsWith(path) ? 'active' : '';
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
    };

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <Link to="/">SwiftServe</Link>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    {/* Common routes for all authenticated users */}
                    <li className={isActive('/products')}>
                        <Link to="/products">Products</Link>
                    </li>

                    {/* Admin/Super User routes */}
                    {(hasRole(ROLE_KEYS.ADMIN) || hasRole(ROLE_KEYS.SUPER_USER)) && (
                        <>
                            <li className={isActive('/product-management')}>
                                <Link to="/product-management">Product Management</Link>
                            </li>
                            <li className={isActive('/order-management')}>
                                <Link to="/order-management">Order Management</Link>
                            </li>
                            {hasRole(ROLE_KEYS.SUPER_USER) && (
                                <li className={isActive('/users')}>
                                    <Link to="/users">User Management</Link>
                                </li>
                            )}
                        </>
                    )}

                    {/* Regular user routes */}
                    {(hasRole(ROLE_KEYS.USER) || hasRole(ROLE_KEYS.SUPER_USER) || hasRole(ROLE_KEYS.ADMIN)) && (
                        <>
                            <li className={isActive('/my-orders')}>
                                <Link to="/my-orders">My Orders</Link>
                            </li>
                            <li className={isActive('/wallet')}>
                                <Link to="/wallet">Wallet</Link>
                            </li>
                            <li className={isActive('/deposit')}>
                                <Link to="/deposit">Add Funds</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>

            <div className="sidebar-footer">
                {user && (
                    <div className="user-info">
                        <WalletBalance />
                        <span>{user.email}</span>
                        <span className="user-role">{user.roles?.[0]}</span>
                        <a href="/logout" onClick={handleLogout} className="logout-btn">
                            Logout
                        </a>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;