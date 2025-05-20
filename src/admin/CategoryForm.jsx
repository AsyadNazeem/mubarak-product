import React, { useState, useEffect } from 'react';
import { Save, X, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import CategoryService from '../context/CategoryService';

const CategoryForm = () => {
    // Get auth context
    const auth = useAuth();

    // State for form data
    const [formData, setFormData] = useState({
        categoryId: '',
        name: '',
        description: '',
        status: 'active',
        image: null,
        imagePreview: null
    });

    // State for error messages
    const [errors, setErrors] = useState({});

    // State for form submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // State for existing categories
    const [existingCategories, setExistingCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load existing categories from API when component mounts
    useEffect(() => {
        fetchCategories();
    }, []);

    // Fetch categories from API using CategoryService
    const fetchCategories = async () => {
        try {
            setIsLoading(true);
            const response = await CategoryService.getCategories();

            // Check if response contains the expected data structure
            if (response && response.data && Array.isArray(response.data)) {
                // Make sure we're mapping the correct properties
                const categories = response.data.map(cat => ({
                    categoryId: cat.category_id,
                    name: cat.name
                }));

                setExistingCategories(categories);

                // After setting existing categories, generate the next ID
                generateNextCategoryId(categories);
            } else {
                console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error);
            // Handle error appropriately (e.g., show error message)
        } finally {
            setIsLoading(false);
        }
    };

    // Generate the next category ID (client side as a fallback)
    useEffect(() => {
        if (existingCategories.length > 0) {
            // Find the highest existing ID number
            const highestId = existingCategories
                .map(cat => parseInt(cat.categoryId.replace('CAT', ''), 10))
                .reduce((max, current) => Math.max(max, current), 0);

            // Increment and format with leading zeros
            const nextNumber = highestId + 1;
            const nextId = `CAT${String(nextNumber).padStart(4, '0')}`;

            setFormData(prev => ({ ...prev, categoryId: nextId }));
        } else {
            // If no categories exist, start with CAT0001
            setFormData(prev => ({ ...prev, categoryId: 'CAT0001' }));
        }
    }, [existingCategories]);

    const generateNextCategoryId = (categories) => {
        if (categories && categories.length > 0) {
            // Find the highest existing ID number
            const highestId = categories
                .map(cat => {
                    // Extract the numeric part of the ID
                    const match = cat.categoryId.match(/CAT(\d+)/);
                    return match ? parseInt(match[1], 10) : 0;
                })
                .reduce((max, current) => Math.max(max, current), 0);

            // Increment and format with leading zeros
            const nextNumber = highestId + 1;
            const nextId = `CAT${String(nextNumber).padStart(4, '0')}`;

            setFormData(prev => ({ ...prev, categoryId: nextId }));
        } else {
            // If no categories exist, start with CAT0001
            setFormData(prev => ({ ...prev, categoryId: 'CAT0001' }));
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };


    // Handle image upload
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Set the file
            setFormData(prev => ({ ...prev, image: file }));

            // Create a preview URL
            const reader = new FileReader();
            reader.onload = () => {
                setFormData(prev => ({ ...prev, imagePreview: reader.result }));
            };
            reader.readAsDataURL(file);

            // Clear any errors
            if (errors.image) {
                setErrors(prev => ({ ...prev, image: '' }));
            }
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission using CategoryService
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Create a FormData object for file upload
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('status', formData.status);

            if (formData.image) {
                data.append('image', formData.image);
            }

            // Send to API using CategoryService
            const response = await CategoryService.createCategory(data);

            console.log('Category created:', response);

            // Refresh categories list
            await fetchCategories();

            // Show success message
            setSubmitSuccess(true);

            // Reset form
            setFormData({
                categoryId: response.category.category_id, // Use the ID from response or generate new one
                name: '',
                description: '',
                status: 'active',
                image: null,
                imagePreview: null
            });

            // Hide success message after a delay
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error submitting form:', error);

            // Handle validation errors from server
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
            } else {
                setErrors({
                    submit: error.response?.data?.message || 'Failed to save category. Please try again.'
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear form and reset
    const handleClear = () => {
        // Keep the category ID, reset everything else
        setFormData(prev => ({
            ...prev,
            name: '',
            description: '',
            status: 'active',
            image: null,
            imagePreview: null
        }));
        setErrors({});
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Category</h2>

            {submitSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    Category successfully added!
                </div>
            )}

            {errors.submit && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {errors.submit}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category ID */}
                    <div className="mb-4">
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                            Category ID
                        </label>
                        <input
                            type="text"
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            className="w-full p-2 border text-black border-gray-300 rounded-md bg-gray-100"
                            disabled
                            readOnly
                        />
                        <p className="mt-1 text-xs text-gray-500">Auto-generated ID</p>
                    </div>

                    {/* Category Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Category Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-2 border text-black ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter category name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Category Description */}
                    <div className="col-span-1 md:col-span-2 mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={4}
                            className={`w-full p-2 border text-black ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter category description"
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Category Status */}
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border text-black border-gray-300 rounded-md"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Category Image */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category Image
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className={`border-2 border-dashed ${formData.imagePreview ? 'border-green-500' : 'border-gray-300'} rounded-md p-4 flex flex-col items-center justify-center w-32 h-32`}>
                                {formData.imagePreview ? (
                                    <img
                                        src={formData.imagePreview}
                                        alt="Category Preview"
                                        className="w-full h-full text-black object-cover"
                                    />
                                ) : (
                                    <>
                                        <Upload size={24} className="text-gray-400 mb-2" />
                                        <p className="text-xs text-gray-500">Upload Image</p>
                                    </>
                                )}
                            </div>

                            <div className="flex-1">
                                <input
                                    type="file"
                                    id="image"
                                    name="image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                                <label
                                    htmlFor="image"
                                    className="cursor-pointer inline-block px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                                >
                                    Choose File
                                </label>
                                <p className="mt-1 text-xs text-gray-500">Recommended size: 500x500 pixels</p>

                                {formData.image && (
                                    <p className="mt-1 text-xs text-gray-700">
                                        Selected: {formData.image.name}
                                    </p>
                                )}

                                {errors.image && (
                                    <p className="mt-1 text-xs text-red-500">{errors.image}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end space-x-4 mt-6">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition flex items-center"
                    >
                        <X size={16} className="mr-2" />
                        Clear
                    </button>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#D62B31] text-white rounded-md hover:bg-[#912923] transition flex items-center"
                    >
                        <Save size={16} className="mr-2" />
                        {isSubmitting ? 'Saving...' : 'Save Category'}
                    </button>
                </div>
            </form>

            {/* Display existing categories */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-3">Existing Categories</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                    {isLoading ? (
                        <p className="text-gray-500">Loading categories...</p>
                    ) : existingCategories.length === 0 ? (
                        <p className="text-gray-500">No categories found. Add your first category above.</p>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">ID</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Name</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {existingCategories.map((category) => (
                                <tr key={category.categoryId}>
                                    <td className="py-3 text-sm font-medium text-gray-900">{category.categoryId}</td>
                                    <td className="py-3 text-sm text-gray-700">{category.name}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryForm;
