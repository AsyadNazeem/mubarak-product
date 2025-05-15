import React, { useState, useEffect } from 'react';
import { Save, X, Upload, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const SubCategoryForm = () => {
    const { checkAuthStatus } = useAuth();

    // State for form data
    const [formData, setFormData] = useState({
        sub_category_id: '', // Changed from subcategory_id to sub_category_id
        name: '',
        category_id: '',
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
    const [submitMessage, setSubmitMessage] = useState('');

    // State for parent categories (now fetched from API)
    const [parentCategories, setParentCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    // State for existing subcategories
    const [existingSubCategories, setExistingSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load subcategories, parent categories, and generate ID when component mounts
    useEffect(() => {
        loadSubCategories();
        loadParentCategories();
        generateSubCategoryId();
    }, []);

    // Function to load parent categories from API
    const loadParentCategories = async () => {
        setLoadingCategories(true);
        try {
            const response = await axios.get('/api/admin/categories');
            console.log("Parent categories response:", response.data); // <-- Add this
            if (response.data.success) {
                setParentCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error loading parent categories:', error);
        } finally {
            setLoadingCategories(false);
        }
    };

    console.log(parentCategories); // Check if it has valid data

    // Function to generate next subcategory ID from API
    const generateSubCategoryId = async () => {
        try {
            const response = await axios.get('/api/admin/subcategories/generate-id');
            if (response.data.success) {
                setFormData(prev => ({ ...prev, sub_category_id: response.data.sub_category_id }));
            }
        } catch (error) {
            console.error('Error generating subcategory ID:', error);
            // Fallback to client-side generation if API fails
            let nextId = 'SUB0001';
            if (existingSubCategories.length > 0) {
                // Find the highest existing ID number
                const highestId = existingSubCategories
                    .map(cat => parseInt(cat.sub_category_id.replace('SUB', ''), 10))
                    .reduce((max, current) => Math.max(max, current), 0);

                // Increment and format with leading zeros
                const nextNumber = highestId + 1;
                nextId = `SUB${String(nextNumber).padStart(4, '0')}`;
            }
            setFormData(prev => ({ ...prev, sub_category_id: nextId }));
        }
    };

    // Load subcategories from API
    const loadSubCategories = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/admin/subcategories');
            if (response.data.success) {
                setExistingSubCategories(response.data.data);
            }
        } catch (error) {
            console.error('Error loading subcategories:', error);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
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
            newErrors.name = 'Subcategory name is required';
        }

        if (!formData.category_id) {
            newErrors.category_id = 'Parent category is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setSubmitSuccess(false);
        setSubmitMessage('');

        try {

            const formDataObj = new FormData();
            formDataObj.append('sub_category_id', formData.sub_category_id); // Match database column name
            formDataObj.append('name', formData.name);
            formDataObj.append('category_id', formData.category_id);
            formDataObj.append('description', formData.description);
            formDataObj.append('status', formData.status);

            if (formData.image) {
                formDataObj.append('image', formData.image);
            }

            // Submit to API
            const response = await axios.post('/api/admin/subcategories', formDataObj, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                // Show success message
                setSubmitSuccess(true);
                setSubmitMessage('Subcategory successfully added!');

                // Refresh the subcategories list
                loadSubCategories();

                // Reset form after submission
                setFormData({
                    sub_category_id: '', // Changed from subcategory_id to sub_category_id
                    name: '',
                    category_id: '',
                    description: '',
                    status: 'active',
                    image: null,
                    imagePreview: null
                });

                // Generate new ID for next submission
                generateSubCategoryId();

                // Hide success message after a delay
                setTimeout(() => {
                    setSubmitSuccess(false);
                    setSubmitMessage('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitSuccess(false);

            if (error.response && error.response.data && error.response.data.errors) {
                // Set validation errors from API
                setErrors(error.response.data.errors);
                setSubmitMessage('Failed to save subcategory. Please check the form fields.');
            } else {
                setSubmitMessage(error.response?.data?.message || 'Failed to save subcategory. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear form and reset
    const handleClear = () => {
        // Keep the subcategory ID, reset everything else
        setFormData(prev => ({
            ...prev,
            name: '',
            category_id: '',
            description: '',
            status: 'active',
            image: null,
            imagePreview: null
        }));
        setErrors({});
        setSubmitMessage('');
    };

    // Get parent category name for display in the table
    const getParentCategoryName = (categoryId) => {
        const category = parentCategories.find(cat => cat.category_id === categoryId);
        return category ? category.name : 'Unknown';
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Subcategory</h2>

            {submitSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                    {submitMessage || 'Subcategory successfully added to the database!'}
                </div>
            )}

            {!submitSuccess && submitMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                    {submitMessage}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Subcategory ID */}
                    <div className="mb-4">
                        <label htmlFor="sub_category_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory ID
                        </label>
                        <input
                            type="text"
                            id="sub_category_id"
                            name="sub_category_id"
                            value={formData.sub_category_id}
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                            disabled
                            readOnly
                        />
                        <p className="mt-1 text-xs text-gray-500">Auto-generated ID</p>
                    </div>

                    {/* Parent Category */}
                    <div className="mb-4">
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Category *
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.category_id ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        >
                            <option value="">Select Parent Category</option>
                            {loadingCategories ? (
                                <option disabled>Loading categories...</option>
                            ) : (
                                parentCategories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.category_id && (
                            <p className="mt-1 text-xs text-red-500">{errors.category_id}</p>
                        )}
                    </div>

                    {/* Subcategory Name */}
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter subcategory name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Subcategory Status */}
                    <div className="mb-4">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Subcategory Description */}
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
                            className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter subcategory description"
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Subcategory Image */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory Image
                        </label>
                        <div className="flex items-center space-x-4">
                            <div className={`border-2 border-dashed ${formData.imagePreview ? 'border-green-500' : 'border-gray-300'} rounded-md p-4 flex flex-col items-center justify-center w-32 h-32`}>
                                {formData.imagePreview ? (
                                    <img
                                        src={formData.imagePreview}
                                        alt="Subcategory Preview"
                                        className="w-full h-full object-cover"
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
                        {isSubmitting ? 'Saving...' : 'Save Subcategory'}
                    </button>
                </div>
            </form>

            {/* Display existing subcategories from database */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-semibold text-gray-700">Database Records</h3>
                    <button
                        onClick={loadSubCategories}
                        className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                    >
                        <RefreshCw size={14} className="mr-1" />
                        Refresh Data
                    </button>
                </div>
                <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                    {loading ? (
                        <div className="text-center py-4">Loading subcategories...</div>
                    ) : (
                        <table className="min-w-full">
                            <thead>
                            <tr>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">ID</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Name</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Parent Category</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Description</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Status</th>
                                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-3">Created At</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {existingSubCategories.map((subCategory) => (
                                <tr key={subCategory.sub_category_id || subCategory.id}>
                                    <td className="py-3 text-sm font-medium text-gray-900">{subCategory.sub_category_id}</td>
                                    <td className="py-3 text-sm text-gray-700">{subCategory.name}</td>
                                    <td className="py-3 text-sm text-gray-700">{getParentCategoryName(subCategory.category_id)}</td>
                                    <td className="py-3 text-sm text-gray-700">{subCategory.description?.length > 30 ?
                                        subCategory.description.substring(0, 30) + '...' : subCategory.description}</td>
                                    <td className="py-3 text-sm text-gray-700">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            subCategory.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {subCategory.status}
                                        </span>
                                    </td>
                                    <td className="py-3 text-sm text-gray-700">
                                        {new Date(subCategory.created_at).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                            {existingSubCategories.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-4 text-center text-sm text-gray-500">
                                        No subcategories found in database
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Database status panel */}
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
                <h4 className="text-sm font-semibold text-blue-700 mb-2">Database Information</h4>
                <div className="text-xs text-blue-600">
                    <p>• Table: sub_categories</p>
                    <p>• Storage: MySQL database</p>
                    <p>• Total Records: {existingSubCategories.length}</p>
                    <p>• Schema: id, sub_category_id, name, category_id, description, status, image_path, created_at, updated_at</p>
                </div>
            </div>
        </div>
    );
};

export default SubCategoryForm;
