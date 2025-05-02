import { useAuth } from '../context/AuthContext'; 
import ProductList from '../products/ProductList';
import CartButton from '../cart/CartButton';
import CartModal from '../cart/CartModal';

const ProductListPage = () => {
    const { isAuthenticated } = useAuth();
    return (
        <div className="page-container">
            <ProductList />

            {/* Only show cart components if authenticated */}
            {isAuthenticated && (
                <>
                    <CartButton />
                    <CartModal />
                </>
            )}
        </div>
    );
};

export default ProductListPage;
