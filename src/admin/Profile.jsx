import React, { useState, useEffect } from 'react';
import { User, Mail, Save, User2 } from 'lucide-react';
import axios from 'axios';

const Profile = () => {
    // State for form data
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    // State for profile image
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    // State for loading, success and error messages
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Fetch user data from the API
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setIsLoading(true);

                // Get token from localStorage
                const token = localStorage.getItem('adminToken');

                if (!token) {
                    throw new Error('Authentication token not found');
                }

                // Set auth header for this request
                const headers = {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                };

                // Make API call to get profile data
                const response = await axios.get('/api/admin/profile', { headers });
                const data = response.data;

                if (data.success) {
                    setFormData({
                        name: data.profile.name || '',
                        email: data.profile.email || '',
                    });

                    // If profile image exists, set it
                    if (data.profile.profile_image) {
                        setImagePreview(data.profile.profile_image);
                    }
                } else {
                    setErrorMessage(data.message || 'Failed to load profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);

                // Better error handling
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    if (error.response.status === 401) {
                        setErrorMessage('Your session has expired. Please log in again.');
                    } else {
                        setErrorMessage(`Error: ${error.response.data.message || error.response.statusText}`);
                    }
                } else if (error.request) {
                    // The request was made but no response was received
                    setErrorMessage('No response from server. Please check your connection.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    setErrorMessage(error.message || 'Error fetching profile data. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle profile image change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
            // Validation
            if (!formData.name.trim()) {
                throw new Error('Name cannot be empty');
            }

            if (!formData.email.trim()) {
                throw new Error('Email cannot be empty');
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                throw new Error('Please enter a valid email address');
            }

            // Get token from localStorage
            const token = localStorage.getItem('adminToken');

            if (!token) {
                throw new Error('Authentication token not found');
            }

            // Create FormData to send to the server
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('email', formData.email);

            // Append profile image if a new one was selected
            if (profileImage) {
                formDataToSend.append('profile_image', profileImage);
            }

            // Send data to the server
            const response = await axios.post('/api/admin/profile', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json',
                    // No Content-Type header is needed as FormData sets it automatically with the boundary
                }
            });

            const data = response.data;

            if (data.success) {
                setSuccessMessage('Profile updated successfully!');
                // Update image preview if a new URL is returned
                if (data.profile && data.profile.profile_image) {
                    setImagePreview(data.profile.profile_image);
                }
            } else {
                throw new Error(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);

            // Better error handling
            if (error.response) {
                if (error.response.status === 401) {
                    setErrorMessage('Your session has expired. Please log in again.');
                } else if (error.response.status === 422) {
                    // Validation errors
                    const validationErrors = error.response.data.errors;
                    let errorMsg = 'Validation failed: ';

                    if (validationErrors) {
                        errorMsg += Object.values(validationErrors).flat().join(', ');
                    } else {
                        errorMsg += error.response.data.message || 'Please check your input';
                    }

                    setErrorMessage(errorMsg);
                } else {
                    setErrorMessage(`Error: ${error.response.data.message || error.response.statusText}`);
                }
            } else if (error.request) {
                setErrorMessage('No response from server. Please check your connection.');
            } else {
                setErrorMessage(error.message || 'Failed to update profile. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <p className="text-gray-600">Update your account information</p>
            </div>

            <div>
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

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-md">
                        Loading profile data...
                    </div>
                )}

                {/* Profile Picture */}
                <div className="mb-6 flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center mb-4">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Profile Preview"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User size={48} className="text-gray-500" />
                        )}
                    </div>
                    <input
                        type="file"
                        id="profileImage"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <label
                        htmlFor="profileImage"
                        className="text-[#D62B31] hover:text-[#912923] font-medium cursor-pointer"
                    >
                        {imagePreview ? 'Change Profile Picture' : 'Upload Profile Picture'}
                    </label>
                </div>

                {/* Name Field */}
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                        Name
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User2 size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="pl-10 w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D62B31] focus:border-transparent"
                            placeholder="Enter your name"
                        />
                    </div>
                </div>

                {/* Email Field */}
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail size={18} className="text-gray-500" />
                        </div>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="pl-10 w-full p-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D62B31] focus:border-transparent"
                            placeholder="Enter your email address"
                        />
                    </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex items-center bg-[#D62B31] hover:bg-[#912923] text-white font-medium py-2 px-4 rounded-md transition-colors duration-300"
                    >
                        {isLoading ? (
                            <>
                                <span className="animate-spin mr-2">⚪</span>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
