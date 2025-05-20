import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

const AdminRegisterForm = () => {
    const { getBasePath, getAdminPath } = useAuth(); // Use auth context functions

    // State for form fields
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });

    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // State for form submission status
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [errors, setErrors] = useState({});

    // Check password requirements when password changes
    useEffect(() => {
        validatePassword(formData.password);
    }, [formData.password]);

    // Validate password requirements
    const validatePassword = (password) => {
        setPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
        });
    };

    // Check if all password requirements are met
    const allPasswordRequirementsMet = () => {
        return Object.values(passwordValidation).every(value => value === true);
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        // Clear field-specific error when user types
        if (errors[name]) {
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: ''
            }));
        }
    };

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!allPasswordRequirementsMet()) {
            newErrors.password = 'Password does not meet all requirements';
        }

        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset messages
        setMessage({ text: '', type: '' });

        // Validate form
        if (!validateForm()) {
            setMessage({ text: 'Please fix the errors in the form', type: 'error' });
            return;
        }

        try {
            setLoading(true);

            // Get CSRF cookie first (important for Sanctum)
            try {
                await axios.get('/sanctum/csrf-cookie');
            } catch (csrfError) {
                console.warn('Failed to get CSRF cookie:', csrfError);
                // Continue anyway as it might not be required for token auth
            }

            // Send registration request to backend
            const response = await axios.post('/api/admin/register', formData);

            console.log('Registration response:', response.data);

            // Handle successful registration
            setMessage({
                text: 'Admin registered successfully!',
                type: 'success'
            });

            // Clear form
            setFormData({
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            });

        } catch (error) {
            console.error('Registration error:', error);

            // Handle validation errors from Laravel
            if (error.response?.data?.errors) {
                const serverErrors = error.response.data.errors;
                const formattedErrors = {};

                // Map server validation errors to form fields
                Object.keys(serverErrors).forEach(key => {
                    formattedErrors[key] = serverErrors[key][0]; // Take first error message
                });

                setErrors(formattedErrors);
                setMessage({
                    text: 'Please fix the errors in the form',
                    type: 'error'
                });
            } else {
                // Set general error message
                setMessage({
                    text: error.response?.data?.message || 'Failed to register admin. Please try again.',
                    type: 'error'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Register New Admin</h2>
                <p className="text-gray-600">Create a new administrator account</p>
            </div>

            {/* Status Message */}
            {message.text && (
                <div className={`mb-6 p-4 rounded-md ${
                    message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                }`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#D62B31] focus:border-transparent ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter full name"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                {/* Email Field */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#D62B31] focus:border-transparent ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter email address"
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#D62B31] focus:border-transparent ${
                            errors.password ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter password"
                    />
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                    )}

                    {/* Password Requirements */}
                    <div className="mt-3 p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                        <ul className="space-y-1">
                            <li className="flex items-center text-sm">
                                <span className={`mr-2 ${passwordValidation.length ? 'text-green-600' : 'text-gray-400'}`}>
                                    {passwordValidation.length ? '✓' : '○'}
                                </span>
                                <span className={passwordValidation.length ? 'text-green-600' : 'text-gray-600'}>
                                    At least 8 characters
                                </span>
                            </li>
                            <li className="flex items-center text-sm">
                                <span className={`mr-2 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                    {passwordValidation.uppercase ? '✓' : '○'}
                                </span>
                                <span className={passwordValidation.uppercase ? 'text-green-600' : 'text-gray-600'}>
                                    At least one uppercase letter
                                </span>
                            </li>
                            <li className="flex items-center text-sm">
                                <span className={`mr-2 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                                    {passwordValidation.lowercase ? '✓' : '○'}
                                </span>
                                <span className={passwordValidation.lowercase ? 'text-green-600' : 'text-gray-600'}>
                                    At least one lowercase letter
                                </span>
                            </li>
                            <li className="flex items-center text-sm">
                                <span className={`mr-2 ${passwordValidation.number ? 'text-green-600' : 'text-gray-400'}`}>
                                    {passwordValidation.number ? '✓' : '○'}
                                </span>
                                <span className={passwordValidation.number ? 'text-green-600' : 'text-gray-600'}>
                                    At least one number
                                </span>
                            </li>
                            <li className="flex items-center text-sm">
                                <span className={`mr-2 ${passwordValidation.special ? 'text-green-600' : 'text-gray-400'}`}>
                                    {passwordValidation.special ? '✓' : '○'}
                                </span>
                                <span className={passwordValidation.special ? 'text-green-600' : 'text-gray-600'}>
                                    At least one special character
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-[#D62B31] focus:border-transparent ${
                            errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Confirm password"
                    />
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full px-4 py-2 bg-[#D62B31]  text-white font-medium rounded-md hover:bg-[#912923] transition-colors ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Registering...' : 'Register Admin'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminRegisterForm;
