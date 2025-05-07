import api from './api';

export const getCategories = async () => {
    try {
        const response = await api.get('/category'); 
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};

export const getProducts = async () => {
    try {
        const response = await api.get('/products');

        
        if (response.data?.products) {
          
            if (typeof response.data.products === 'object' && !Array.isArray(response.data.products)) {
                return Object.values(response.data.products);
            }
            return response.data.products;
        }
        return []; 
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const getProductsByCategory = async (categoryId, page = 1, pageSize = 10) => {
    try {
        const response = await api.get(`/categories/${categoryId}/products`, {
            params: { page, pageSize }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching products by category:', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });

        const response = await api.post('/products', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error creating product:', error);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });

        const response = await api.put(`/products/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
};