import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Save } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Adjust this path as needed

const ChangePasswordForm = () => {
    // State for form data
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    // State for showing/hiding passwords
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // State for loading, success and error messages
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errors, setErrors] = useState({});

    // Password validation state
    const [passwordValidation, setPasswordValidation] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
    });

    // Get auth context for API calls
    const auth = useAuth();

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        // Validate password if the changed field is new_password
        if (name === 'new_password') {
            validatePassword(value);
        }
    };

    // Validate password
    const validatePassword = (password) => {
        setPasswordValidation({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        });
    };

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        if (field === 'current') {
            setShowCurrentPassword(!showCurrentPassword);
        } else if (field === 'new') {
            setShowNewPassword(!showNewPassword);
        } else if (field === 'confirm') {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        setErrors({});

        try {
            // Validation
            if (!formData.current_password || !formData.new_password || !formData.new_password_confirmation) {
                throw new Error('All fields are required');
            }

            // Check if new password meets requirements
            const validationPassed = Object.values(passwordValidation).every(val => val);
            if (!validationPassed) {
                throw new Error('Password does not meet all requirements');
            }

            // Check if passwords match
            if (formData.new_password !== formData.new_password_confirmation) {
                throw new Error('New password and confirm password do not match');
            }

            // Make API request to change password
            const response = await axios.post('/api/admin/change-password', formData);

            if (response.data.success) {
                setSuccessMessage(response.data.message || 'Password updated successfully!');

                // Reset form
                setFormData({
                    current_password: '',
                    new_password: '',
                    new_password_confirmation: ''
                });

                // Reset password validation
                validatePassword('');
            } else {
                throw new Error(response.data.message || 'Failed to update password');
            }
        } catch (error) {
            console.error('Password change error:', error);

            // Handle validation errors from the backend
            if (error.response && error.response.data && error.response.data.errors) {
                setErrors(error.response.data.errors);
                setErrorMessage('Please correct the errors below');
            } else {
                setErrorMessage(error.response?.data?.message || error.message || 'Failed to update password. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Change Password</h2>
                <p className="text-gray-600">Update your password to keep your account secure</p>
            </div>

            {/* Password Change Form */}
            <form onSubmit={handleSubmit}>
                {/* Success Message */}
                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
                        {successMessage}
                    </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {errorMessage}
                    </div>
                )}

                {/* Current Password Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current_password">
                        Current Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-500" />
                        </div>
                        <input
                            type={showCurrentPassword ? "text" : "password"}
                            id="current_password"
                            name="current_password"
                            value={formData.current_password}
                            onChange={handleInputChange}
                            className={`pl-10 w-full p-3 border text-black ${
                                errors.current_password ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Enter your current password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('current')}
                        >
                            {showCurrentPassword ?
                                <EyeOff size={18} className="text-gray-500" /> :
                                <Eye size={18} className="text-gray-500" />
                            }
                        </button>
                    </div>
                    {errors.current_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.current_password[0]}</p>
                    )}
                </div>

                {/* New Password Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_password">
                        New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-500" />
                        </div>
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="new_password"
                            name="new_password"
                            value={formData.new_password}
                            onChange={handleInputChange}
                            className={`pl-10 w-full p-3 border text-black ${
                                errors.new_password ? 'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Enter your new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('new')}
                        >
                            {showNewPassword ?
                                <EyeOff size={18} className="text-gray-500" /> :
                                <Eye size={18} className="text-gray-500" />
                            }
                        </button>
                    </div>
                    {errors.new_password && (
                        <p className="text-red-500 text-sm mt-1">{errors.new_password[0]}</p>
                    )}
                </div>

                {/* Password Requirements */}
                <div className="mb-4 bg-gray-50 p-4 rounded-md">
                    <p className="text-sm font-medium text-gray-700 mb-2">Password Requirements:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                        <li className={`flex items-center ${passwordValidation.length ? 'text-green-600' : ''}`}>
                            <span className={`mr-2 ${passwordValidation.length ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordValidation.length ? '✓' : '○'}
                            </span>
                            At least 8 characters
                        </li>
                        <li className={`flex items-center ${passwordValidation.uppercase ? 'text-green-600' : ''}`}>
                            <span className={`mr-2 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordValidation.uppercase ? '✓' : '○'}
                            </span>
                            At least one uppercase letter
                        </li>
                        <li className={`flex items-center ${passwordValidation.lowercase ? 'text-green-600' : ''}`}>
                            <span className={`mr-2 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordValidation.lowercase ? '✓' : '○'}
                            </span>
                            At least one lowercase letter
                        </li>
                        <li className={`flex items-center ${passwordValidation.number ? 'text-green-600' : ''}`}>
                            <span className={`mr-2 ${passwordValidation.number ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordValidation.number ? '✓' : '○'}
                            </span>
                            At least one number
                        </li>
                        <li className={`flex items-center ${passwordValidation.special ? 'text-green-600' : ''}`}>
                            <span className={`mr-2 ${passwordValidation.special ? 'text-green-600' : 'text-gray-400'}`}>
                                {passwordValidation.special ? '✓' : '○'}
                            </span>
                            At least one special character
                        </li>
                    </ul>
                </div>

                {/* Confirm Password Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new_password_confirmation">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock size={18} className="text-gray-500" />
                        </div>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="new_password_confirmation"
                            name="new_password_confirmation"
                            value={formData.new_password_confirmation}
                            onChange={handleInputChange}
                            className={`pl-10 w-full p-3 border text-black ${
                                errors.new_password_confirmation ?  'border-red-500' : 'border-gray-300'
                            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            placeholder="Confirm your new password"
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => togglePasswordVisibility('confirm')}
                        >
                            {showConfirmPassword ?
                                <EyeOff size={18} className="text-gray-500" /> :
                                <Eye size={18} className="text-gray-500" />
                            }
                        </button>
                    </div>
                    {errors.new_password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">{errors.new_password_confirmation[0]}</p>
                    )}
                    {formData.new_password && formData.new_password_confirmation &&
                        formData.new_password !== formData.new_password_confirmation && (
                            <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                        )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-300 disabled:bg-blue-300"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin mr-2">⚪</span>
                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Update Password
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChangePasswordForm;
