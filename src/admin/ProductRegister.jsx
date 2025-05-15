import React, {useEffect, useState} from 'react';
import {Plus, Save, Trash2, Upload, X} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
import axios from 'axios';
import ProductService from '../context/ProductService';

const ProductForm = () => {
    // State for form data
    const [formData, setFormData] = useState({
        productId: '',
        name: '',
        description: '',
        categoryId: '',
        subCategoryId: '',
        price: '',
        costPrice: '',
        stockQuantity: '',
        sku: '',
        barcode: '',
        weight: '',
        status: 'active',
        featured: false,
        images: [],
        imagePreview: null,
        specifications: [{key: '', value: ''}],
        variants: [{name: '', options: ''}],
    });

    // State for error messages
    const [errors, setErrors] = useState({});

    // State for form submission status
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    // Using the submitMessage variable to display success/error messages to the user
    const [submitMessage, setSubmitMessage] = useState('Product saved successfully!');

    // State for existing products (will fetch from API)
    const [existingProducts, setExistingProducts] = useState([]);

    // State for categories and subcategories (will fetch from API)
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [filteredSubCategories, setFilteredSubCategories] = useState([]);

    // Loading states
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingSubCategories, setIsLoadingSubCategories] = useState(false);
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Use Auth Context instead of token
    const auth = useAuth();

    // API base URL - you would configure this based on your environment
    const API_BASE_URL = '/api';

    // Fetch categories from API
    const fetchCategories = async () => {
        setIsLoadingCategories(true);
        try {
            // Updated to match your API endpoint pattern from the subcategory form
            const response = await axios.get(`${API_BASE_URL}/admin/categories`);
            console.log("Categories response:", response.data);

            if (response.data.success) {
                setCategories(response.data.data);
            } else {
                console.error('Failed to fetch categories:', response.data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    // Fetch subcategories from API
    const fetchSubCategories = async () => {
        setIsLoadingSubCategories(true);
        try {
            // Updated to match your API endpoint pattern
            const response = await axios.get(`${API_BASE_URL}/admin/subcategories`);
            console.log("Subcategories response:", response.data);

            if (response.data.success) {
                setSubCategories(response.data.data);
            } else {
                console.error('Failed to fetch subcategories:', response.data);
            }
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        } finally {
            setIsLoadingSubCategories(false);
        }
    };

    // Fetch recent products from API
    const fetchRecentProducts = async () => {
        setIsLoadingProducts(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/products/recent`);
            setExistingProducts(response.data);
        } catch (error) {
            console.error('Error fetching recent products:', error);
        } finally {
            setIsLoadingProducts(false);
        }
    };

    // Update this function in your React component
    const generateProductId = async () => {
        try {
            // Make sure this path matches your Laravel route
            const response = await axios.get(`${API_BASE_URL}/admin/products/generate-id`);
            console.log('Product ID API response:', response.data);

            // Check both possible response formats
            const newProductId = response.data.product_id || response.data.nextId;

            if (newProductId) {
                setFormData(prevState => ({...prevState, productId: newProductId}));
                console.log('Setting new product ID:', newProductId);
            } else {
                console.error('Error: Product ID not found in API response');
                // Fallback if API doesn't return expected structure
                generateFallbackProductId();
            }
        } catch (error) {
            console.error('Error generating product ID:', error);
            // Fallback to local generation if API fails
            generateFallbackProductId();
        }
    };

// Also update this test function to match the correct endpoint
    useEffect(() => {
        // Test product ID generation directly
        const testProductIdApi = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/products/generate-id`);
                console.log('Direct API test - Product ID response:', response.data);
            } catch (error) {
                console.error('Direct API test failed:', error);
            }
        };

        if (auth.admin) {
            testProductIdApi();
        }
    }, [auth.admin]);

    // Fetch data when component mounts
    useEffect(() => {
        // Check if user is authenticated before fetching data
        if (auth.admin) {
            fetchCategories();
            fetchSubCategories();
            fetchRecentProducts();
            generateProductId();
        }
    }, [auth.admin]);

    // Log loaded categories and subcategories for debugging
    useEffect(() => {
        console.log("Loaded categories:", categories);
    }, [categories]);

    useEffect(() => {
        console.log("Loaded subcategories:", subCategories);
    }, [subCategories]);

    // Update filtered subcategories when category changes
    useEffect(() => {
        if (formData.categoryId) {
            console.log("Filtering subcategories for category:", formData.categoryId);
            // Filter subcategories by the selected category ID
            // Use the right field names based on your API response
            const filtered = subCategories.filter(sc => sc.category_id === formData.categoryId);
            console.log("Filtered subcategories:", filtered);
            setFilteredSubCategories(filtered);

            // Only reset subcategory selection if the current one doesn't belong to the selected category
            // This prevents resetting when the component initially renders or when we don't need to
            const currentSubCategoryExists = filtered.some(sc => sc.subcategory_id === formData.subCategoryId);
            if (!currentSubCategoryExists && formData.subCategoryId !== '') {
                setFormData(prevState => ({...prevState, subCategoryId: ''}));
            }
        } else {
            setFilteredSubCategories([]);
            setFormData(prevState => ({...prevState, subCategoryId: ''}));
        }
    }, [formData.categoryId, subCategories]);

    // Generate SKU based on product details
    const generateSku = async () => {
        if (formData.categoryId && formData.subCategoryId && formData.name) {
            try {
                // Try to generate SKU from server for better uniqueness
                const response = await axios.post(
                    `${API_BASE_URL}/products/generate-sku`,
                    {
                        categoryId: formData.categoryId,
                        subCategoryId: formData.subCategoryId,
                        name: formData.name
                    }
                );
                setFormData(prevState => ({...prevState, sku: response.data.sku}));
            } catch (error) {
                console.error('Error generating SKU from server:', error);
                // Fallback to client-side generation
                const categoryPrefix = formData.categoryId.substring(0, 3).toUpperCase();
                const subCategoryPrefix = formData.subCategoryId.substring(0, 3).toUpperCase();
                const namePrefix = formData.name.substring(0, 3).toUpperCase();
                const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

                const sku = `${categoryPrefix}-${subCategoryPrefix}-${namePrefix}-${randomNum}`;
                setFormData(prevState => ({...prevState, sku}));
            }
        }
    };

    // Handle input changes
    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;

        // Handle checkbox inputs
        if (type === 'checkbox') {
            setFormData(prevState => ({...prevState, [name]: checked}));
        }
        // Handle numeric inputs
        else if (name === 'price' || name === 'costPrice' || name === 'stockQuantity' || name === 'weight') {
            // Allow only numbers and a single decimal point for price fields
            if (name === 'price' || name === 'costPrice' || name === 'weight') {
                if (value === '' || /^\d*\.?\d*$/.test(value)) {
                    setFormData(prevState => ({...prevState, [name]: value}));
                }
            } else {
                // Allow only integer values for stock quantity
                if (value === '' || /^\d*$/.test(value)) {
                    setFormData(prevState => ({...prevState, [name]: value}));
                }
            }
        }
        // Handle other text inputs
        else {
            setFormData(prevState => ({...prevState, [name]: value}));
        }

        // If changing category, trigger SKU generation
        if (name === 'categoryId' || name === 'subCategoryId' || name === 'name') {
            // Only try to generate SKU after a short delay to avoid excessive calls
            if (name === 'name' && value.length > 2) {
                setTimeout(() => {
                    generateSku();
                }, 500);
            } else if (name !== 'name') {
                setTimeout(() => {
                    generateSku();
                }, 100);
            }
        }

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prevState => ({...prevState, [name]: ''}));
        }
    };

    // Handle image upload
    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            // Add the files to the existing images array
            setFormData(prevState => ({
                ...prevState,
                images: [...prevState.images, ...files],
                imagePreview: URL.createObjectURL(files[0]) // Preview the first image
            }));

            // Clear any errors
            if (errors.images) {
                setErrors(prevState => ({...prevState, images: ''}));
            }
        }
    };

    // Remove an image from the array
    const handleRemoveImage = (index) => {
        setFormData(prevState => {
            const updatedImages = [...prevState.images];
            updatedImages.splice(index, 1);

            // Update preview if we removed the current preview image
            let updatedPreview = prevState.imagePreview;
            if (updatedImages.length === 0) {
                updatedPreview = null;
            } else if (index === 0 && prevState.imagePreview) {
                updatedPreview = URL.createObjectURL(updatedImages[0]);
            }

            return {...prevState, images: updatedImages, imagePreview: updatedPreview};
        });
    };

    // Handle specification changes
    const handleSpecificationChange = (index, field, value) => {
        const updatedSpecifications = [...formData.specifications];
        updatedSpecifications[index] = {...updatedSpecifications[index], [field]: value};
        setFormData(prevState => ({...prevState, specifications: updatedSpecifications}));
    };

    // Add a new empty specification
    const addSpecification = () => {
        setFormData(prevState => ({
            ...prevState,
            specifications: [...prevState.specifications, {key: '', value: ''}]
        }));
    };

    // Remove a specification
    const removeSpecification = (index) => {
        const updatedSpecifications = [...formData.specifications];
        updatedSpecifications.splice(index, 1);
        setFormData(prevState => ({...prevState, specifications: updatedSpecifications}));
    };

    // Handle variant changes
    const handleVariantChange = (index, field, value) => {
        const updatedVariants = [...formData.variants];
        updatedVariants[index] = {...updatedVariants[index], [field]: value};
        setFormData(prevState => ({...prevState, variants: updatedVariants}));
    };

    // Add a new empty variant
    const addVariant = () => {
        setFormData(prevState => ({
            ...prevState,
            variants: [...prevState.variants, {name: '', options: ''}]
        }));
    };

    // Remove a variant
    const removeVariant = (index) => {
        const updatedVariants = [...formData.variants];
        updatedVariants.splice(index, 1);
        setFormData(prevState => ({...prevState, variants: updatedVariants}));
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.productId) {
            newErrors.productId = 'Product ID is required';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Product name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.categoryId) {
            newErrors.categoryId = 'Category is required';
        }

        if (!formData.subCategoryId) {
            newErrors.subCategoryId = 'Subcategory is required';
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            newErrors.price = 'Valid price is required';
        }

        if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
            newErrors.stockQuantity = 'Valid stock quantity is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        setErrors({});  // Clear previous errors

        try {
            // Create a FormData object
            const apiFormData = new FormData();

            // Add basic product info - ensure productId is included
            apiFormData.append('productId', formData.productId);
            apiFormData.append('name', formData.name);
            apiFormData.append('description', formData.description);
            apiFormData.append('categoryId', formData.categoryId);
            apiFormData.append('subCategoryId', formData.subCategoryId);
            apiFormData.append('price', formData.price);

            // Make sure costPrice is a valid number or leave it empty
            if (formData.costPrice && formData.costPrice !== '') {
                apiFormData.append('costPrice', formData.costPrice);
            }

            apiFormData.append('stockQuantity', formData.stockQuantity);

            // Only add optional fields if they have values
            if (formData.sku && formData.sku !== '') {
                apiFormData.append('sku', formData.sku);
            }

            if (formData.barcode && formData.barcode !== '') {
                apiFormData.append('barcode', formData.barcode);
            }

            if (formData.weight && formData.weight !== '') {
                apiFormData.append('weight', formData.weight);
            }

            apiFormData.append('status', formData.status);
            apiFormData.append('featured', formData.featured ? '1' : '0');

            // Add images
            if (formData.images && formData.images.length > 0) {
                formData.images.forEach((image) => {
                    apiFormData.append('images[]', image);
                });
            }

            // Handle specifications
            const validSpecs = formData.specifications.filter(spec =>
                spec.key && spec.key.trim() && spec.value && spec.value.trim()
            );

            if (validSpecs.length > 0) {
                // Convert specifications to the format expected by server
                validSpecs.forEach((spec, index) => {
                    apiFormData.append(`specifications[${index}][key]`, spec.key.trim());
                    apiFormData.append(`specifications[${index}][value]`, spec.value.trim());
                });
            }

            // Handle variants
            const validVariants = formData.variants.filter(variant =>
                variant.name && variant.name.trim() && variant.options && variant.options.trim()
            );

            if (validVariants.length > 0) {
                // Convert variants to the format expected by server
                validVariants.forEach((variant, index) => {
                    apiFormData.append(`variants[${index}][name]`, variant.name.trim());
                    apiFormData.append(`variants[${index}][options]`, variant.options.trim());
                });
            }

            // Log what's being sent for debugging
            console.log('Sending product data to API:');
            for (let pair of apiFormData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            // Send to API using ProductService
            const response = await ProductService.createProduct(apiFormData);

            console.log('Product created:', response);

            // Show success message
            setSubmitSuccess(true);
            setSubmitMessage('Product saved successfully!');

            // Reset form but keep categories and get a new product ID
            await generateProductId();

            const currentCategoryId = formData.categoryId;
            const currentSubCategoryId = formData.subCategoryId;

            setFormData(prevState => ({
                productId: prevState.productId, // Keep the newly generated ID
                name: '',
                description: '',
                categoryId: currentCategoryId, // Keep the category
                subCategoryId: currentSubCategoryId, // Keep the subcategory
                price: '',
                costPrice: '',
                stockQuantity: '',
                sku: '',
                barcode: '',
                weight: '',
                status: 'active',
                featured: false,
                images: [],
                imagePreview: null,
                specifications: [{key: '', value: ''}],
                variants: [{name: '', options: ''}],
            }));

            // Hide success message after a delay
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 3000);

        } catch (error) {
            console.error('Error submitting form:', error);

            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);

                // Log and set specific validation errors
                if (error.response.data.errors) {
                    console.error('Validation errors:', error.response.data.errors);
                    setErrors(error.response.data.errors);

                    // Display first error message to user
                    const firstErrorField = Object.keys(error.response.data.errors)[0];
                    const firstErrorMessage = error.response.data.errors[firstErrorField][0];
                    setSubmitMessage(`Error: ${firstErrorMessage}`);
                    setSubmitSuccess(false);
                } else {
                    setErrors({
                        submit: error.response.data.message || 'Failed to save product. Please try again.'
                    });
                    setSubmitMessage(error.response.data.message || 'Failed to save product. Please try again.');
                    setSubmitSuccess(false);
                }
            } else {
                setErrors({
                    submit: 'Failed to connect to server. Please try again.'
                });
                setSubmitMessage('Failed to connect to server. Please try again.');
                setSubmitSuccess(false);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Clear form and reset
    const handleClear = () => {
        // Keep the product ID, reset everything else
        setFormData(prevState => ({
            ...prevState,
            name: '',
            description: '',
            categoryId: '',
            subCategoryId: '',
            price: '',
            costPrice: '',
            stockQuantity: '',
            sku: '',
            barcode: '',
            weight: '',
            status: 'active',
            featured: false,
            images: [],
            imagePreview: null,
            specifications: [{key: '', value: ''}],
            variants: [{name: '', options: ''}],
        }));
        setErrors({});
    };

    // Get category name for display in the table
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.name : 'Unknown';
    };

    // Get subcategory name for display in the table
    const getSubCategoryName = (subCategoryId) => {
        const subCategory = subCategories.find(subcat => subcat.subcategory_id === subCategoryId);
        return subCategory ? subCategory.name : 'Unknown';
    };

    // If not authenticated, show message or redirect
    if (auth.loading) {
        return <div>Loading...</div>;
    }

    if (!auth.admin && auth.initialCheckDone) {
        return (
            <div className="text-center p-8">
                <p className="text-lg text-red-600">You need to be logged in to access this page</p>
                <a href={auth.getLoginUrl()} className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded">
                    Go to Login
                </a>
            </div>
        );
    }
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Register New Product</h2>

            {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    <span>{submitMessage}</span>
                </div>
            )}

            {errors.submit && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <span>{errors.submit}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Product ID */}
                    <div className="mb-4">
                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700 mb-1">
                            Product ID
                        </label>
                        <input
                            type="text"
                            id="productId"
                            name="productId"
                            value={formData.productId}
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
                            disabled
                            readOnly
                        />
                        <p className="mt-1 text-xs text-gray-500">Auto-generated ID</p>
                    </div>

                    {/* Product Name */}
                    <div className="mb-4 md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="Enter product name"
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="mb-4">
                        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            id="categoryId"
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.categoryId ? 'border-red-500' : 'border-gray-300'} rounded-md ${isLoadingCategories ? 'bg-gray-100' : ''} text-black`}
                            disabled={isLoadingCategories}
                        >
                            <option value="">Select Category</option>
                            {isLoadingCategories ? (
                                <option disabled>Loading categories...</option>
                            ) : (
                                categories.map(category => (
                                    <option key={category.category_id} value={category.category_id}>
                                        {category.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.categoryId && (
                            <p className="mt-1 text-xs text-red-500">{errors.categoryId}</p>
                        )}
                    </div>

                    {/* Subcategory */}
                    <div className="mb-4">
                        <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-700 mb-1">
                            Subcategory *
                        </label>
                        <select
                            id="subCategoryId"
                            name="subCategoryId"
                            value={formData.subCategoryId}
                            onChange={handleChange}
                            disabled={!formData.categoryId || isLoadingSubCategories}
                            className={`w-full p-2 border ${errors.subCategoryId ? 'border-red-500' : 'border-gray-300'} rounded-md ${!formData.categoryId || isLoadingSubCategories ? 'bg-gray-100' : ''} text-black`}
                        >
                            <option value="">Select Subcategory</option>
                            {isLoadingSubCategories ? (
                                <option disabled>Loading subcategories...</option>
                            ) : filteredSubCategories.length === 0 && formData.categoryId ? (
                                <option disabled>No subcategories found for this category</option>
                            ) : (
                                filteredSubCategories.map(subCategory => (
                                    <option key={subCategory.sub_category_id} value={subCategory.sub_category_id}>
                                        {subCategory.name}
                                    </option>
                                ))
                            )}
                        </select>
                        {errors.subCategoryId && (
                            <p className="mt-1 text-xs text-red-500">{errors.subCategoryId}</p>
                        )}
                    </div>

                    {/* Product Status */}
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
                            <option value="out_of_stock">Out of Stock</option>
                            <option value="discontinued">Discontinued</option>
                        </select>
                    </div>

                    {/* Price */}
                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Price *
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                            </div>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                className={`w-full pl-7 p-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                                placeholder="0.00"
                            />
                        </div>
                        {errors.price && (
                            <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                        )}
                    </div>

                    {/* Cost Price */}
                    <div className="mb-4">
                        <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700 mb-1">
                            Cost Price
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <span className="text-gray-500">$</span>
                            </div>
                            <input
                                type="text"
                                id="costPrice"
                                name="costPrice"
                                value={formData.costPrice}
                                onChange={handleChange}
                                className="w-full pl-7 p-2 border border-gray-300 rounded-md"
                                placeholder="0.00"
                            />
                        </div>
                    </div>

                    {/* Stock Quantity */}
                    <div className="mb-4">
                        <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity *
                        </label>
                        <input
                            type="text"
                            id="stockQuantity"
                            name="stockQuantity"
                            value={formData.stockQuantity}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.stockQuantity ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                            placeholder="0"
                        />
                        {errors.stockQuantity && (
                            <p className="mt-1 text-xs text-red-500">{errors.stockQuantity}</p>
                        )}
                    </div>

                    {/* SKU */}
                    <div className="mb-4">
                        <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                            SKU
                        </label>
                        <div className="flex">
                            <input
                                type="text"
                                id="sku"
                                name="sku"
                                value={formData.sku}
                                onChange={handleChange}
                                className="w-full p-2 border border-gray-300 rounded-l-md"
                                placeholder="SKU"
                            />
                            <button
                                type="button"
                                onClick={generateSku}
                                className="bg-gray-200 text-gray-700 px-3 rounded-r-md hover:bg-gray-300 transition"
                            >
                                Generate
                            </button>
                        </div>
                    </div>

                    {/* Barcode */}
                    <div className="mb-4">
                        <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
                            Barcode
                        </label>
                        <input
                            type="text"
                            id="barcode"
                            name="barcode"
                            value={formData.barcode}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Barcode"
                        />
                    </div>

                    {/* Weight */}
                    <div className="mb-4">
                        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                            Weight (kg)
                        </label>
                        <input
                            type="text"
                            id="weight"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            placeholder="0.00"
                        />
                    </div>

                    {/* Featured Product */}
                    <div className="mb-4 flex items-center">
                        <input
                            type="checkbox"
                            id="featured"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-4 h-4 text-[#D62B31] border-gray-300 rounded focus:ring-[#D62B31]"
                        />
                        <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
                            Feature this product on homepage
                        </label>
                    </div>

                    {/* Product Description */}
                    <div className="col-span-1 md:col-span-3 mb-4">
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
                            placeholder="Enter product description"
                        ></textarea>
                        {errors.description && (
                            <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Product Images */}
                    <div className="col-span-1 md:col-span-3 mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product Images
                        </label>
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Image previews */}
                            {formData.images.map((image, index) => (
                                <div key={index} className="relative">
                                    <div className="border rounded-md p-1 w-32 h-32 flex items-center justify-center">
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt={`Product Image ${index + 1}`}
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
                                    >
                                        <X size={14}/>
                                    </button>
                                </div>
                            ))}

                            {/* Upload button */}
                            <div
                                className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center w-32 h-32 cursor-pointer hover:border-gray-400 transition">
                                <input
                                    type="file"
                                    id="images"
                                    name="images"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                />
                                <label htmlFor="images"
                                       className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                    <Upload size={24} className="text-gray-400 mb-2"/>
                                    <p className="text-xs text-gray-500">Upload Images</p>
                                </label>
                            </div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500">Upload up to 10 product images. First image will be
                            used as the thumbnail.</p>
                    </div>

                    {/* Product Specifications */}
                    <div className="col-span-1 md:col-span-3 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Specifications
                            </label>
                            <button
                                type="button"
                                onClick={addSpecification}
                                className="flex items-center text-xs text-[#D62B31] hover:text-[#912923] transition"
                            >
                                <Plus size={16} className="mr-1"/>
                                Add Specification
                            </button>
                        </div>

                        {formData.specifications.map((spec, index) => (
                            <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 mb-2">
                                <div className="w-full md:w-1/3">
                                    <input
                                        type="text"
                                        value={spec.key}
                                        onChange={(e) => handleSpecificationChange(index, 'key', e.target.value)}
                                        placeholder="Specification Name"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={spec.value}
                                        onChange={(e) => handleSpecificationChange(index, 'value', e.target.value)}
                                        placeholder="Specification Value"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeSpecification(index)}
                                        className="p-2 text-gray-500 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Product Variants */}
                    <div className="col-span-1 md:col-span-3 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                                Variants
                            </label>
                            <button
                                type="button"
                                onClick={addVariant}
                                className="flex items-center text-xs text-[#D62B31] hover:text-[#912923] transition"
                            >
                                <Plus size={16} className="mr-1"/>
                                Add Variant
                            </button>
                        </div>

                        {formData.variants.map((variant, index) => (
                            <div key={index} className="flex flex-wrap md:flex-nowrap gap-4 mb-2">
                                <div className="w-full md:w-1/3">
                                    <input
                                        type="text"
                                        value={variant.name}
                                        onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                                        placeholder="Variant Type (e.g. Color, Size)"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        value={variant.options}
                                        onChange={(e) => handleVariantChange(index, 'options', e.target.value)}
                                        placeholder="Options (comma separated e.g. Red, Blue, Green)"
                                        className="w-full p-2 border border-gray-300 rounded-md"
                                    />
                                </div>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeVariant(index)}
                                        className="p-2 text-gray-500 hover:text-red-500 transition"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Form Actions */}
                    <div className="col-span-1 md:col-span-3 flex items-center justify-end space-x-4 mt-6">
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition flex items-center"
                        >
                            <X size={18} className="mr-2"/>
                            Clear Form
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-[#D62B31] text-white rounded-md hover:bg-[#912923] transition flex items-center"
                        >
                            <Save size={18} className="mr-2"/>
                            {isSubmitting ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>

                </div>
            </form>

            {/* Recent Products Table */}
            <div className="mt-12">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Recent Products</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subcategory</th>
                            <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {existingProducts.slice().reverse().slice(0, 5).map((product) => (
                            <tr key={product.productId} className="hover:bg-gray-50">
                                <td className="py-4 px-4 text-sm text-gray-500">{product.productId}</td>
                                <td className="py-4 px-4 text-sm font-medium text-gray-900">{product.name}</td>
                                <td className="py-4 px-4 text-sm text-gray-500">{getCategoryName(product.categoryId)}</td>
                                <td className="py-4 px-4 text-sm text-gray-500">{getSubCategoryName(product.subCategoryId)}</td>
                                <td className="py-4 px-4 text-sm text-gray-900">${parseFloat(product.price).toFixed(2)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ProductForm;
