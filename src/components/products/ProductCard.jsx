const ProductCard = ({ product }) => {
    // Debug log to inspect the product object structure
    console.log('Product data:', product);

    return (
        <div className="border p-4 rounded shadow-sm bg-white hover:shadow-md transition-shadow">
            {product.imageURL && (
                <img
                    src={product.imageURL}
                    alt={product.productName}
                    className="w-full h-40 object-cover mb-2 rounded"
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150'; // Fallback image
                    }}
                />
            )}
            <h2 className="text-lg font-semibold">{product.productName}</h2>
            <p className="text-sm text-gray-600 mb-2">{product.productDescription}</p>
            <p className="text-green-600 font-bold">
                R{product.productPrice?.toFixed(2) || '0.00'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
                Stock: {product.productStockQuantity}
            </p>
            <p className="text-xs text-gray-500">
                Category: {product.category?.categoryName || 'Unknown'}
            </p>
            <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${product.isAvailable
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {product.isAvailable ? 'Available' : 'Out of Stock'}
                </span>
            </div>
        </div>
    );
};

export default ProductCard;