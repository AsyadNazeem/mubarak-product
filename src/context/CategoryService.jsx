import axios from 'axios';

/**
 * Category API Service
 * Contains methods for interacting with the category management API
 */
export default class CategoryService {
    /**
     * Get all categories
     *
     * @returns {Promise} - Promise resolving to list of categories
     */
    static async getCategories() {
        try {
            const response = await axios.get('/api/admin/categories');
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Get a specific category by ID
     *
     * @param {string|number} id - The category ID or database ID
     * @returns {Promise} - Promise resolving to category data
     */
    static async getCategory(id) {
        try {
            const response = await axios.get(`/api/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Create a new category
     *
     * @param {FormData} formData - Form data containing category information
     * @returns {Promise} - Promise resolving to the created category
     */
    static async createCategory(formData) {
        try {
            const response = await axios.post('/api/admin/categories', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Update an existing category
     *
     * @param {string|number} id - The category ID or database ID
     * @param {FormData} formData - Form data containing updated category information
     * @returns {Promise} - Promise resolving to the updated category
     */
    static async updateCategory(id, formData) {
        try {
            const response = await axios.post(`/api/admin/categories/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Delete a category
     *
     * @param {string|number} id - The category ID or database ID
     * @returns {Promise} - Promise with deletion result
     */
    static async deleteCategory(id) {
        try {
            const response = await axios.delete(`/api/admin/categories/${id}`);
            return response.data;
        } catch (error) {
            this.handleError(error);
            throw error;
        }
    }

    /**
     * Handle API errors
     *
     * @param {Error} error - The error object
     */
    static handleError(error) {
        if (error.response) {
            // The request was made and the server responded with an error status
            console.error('API Error Response:', error.response.status, error.response.data);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('API Error Request:', error.request);
        } else {
            // Something happened in setting up the request
            console.error('API Error:', error.message);
        }
    }
}
