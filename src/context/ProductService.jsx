// src/context/ProductService.js
import axios from 'axios';

const API_BASE_URL = '/api';

const ProductService = {
    getProducts: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/products`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    createProduct: async (productData) => {
        try {
            // Log the form data being sent (for debugging)
            for (let pair of productData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await axios.post(
                `${API_BASE_URL}/admin/products`,
                productData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true,
                }
            );
            return response.data;
        } catch (error) {
            // Enhanced error logging
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Server responded with error:', {
                    status: error.response.status,
                    data: error.response.data,
                    headers: error.response.headers
                });
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error setting up request:', error.message);
            }
            throw error;
        }
    },

    getProduct: async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/products/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    },

    updateProduct: async (id, productData) => {
        try {
            // Add _method=PUT to support form data with PUT method
            productData.append('_method', 'PUT');

            const response = await axios.post(
                `${API_BASE_URL}/admin/products/${id}`,
                productData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    withCredentials: true
                }
            );
            return response.data;
        } catch (error) {
            console.error(`Error updating product ${id}:`, error);
            throw error;
        }
    },

    deleteProduct: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/admin/products/${id}`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting product ${id}:`, error);
            throw error;
        }
    },

    generateProductId: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/products/generate-id`, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            console.error('Error generating product ID:', error);
            throw error;
        }
    }
};

export default ProductService;
