import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Eye, EyeOff} from 'lucide-react';

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [visiblePasswords, setVisiblePasswords] = useState({});
    const [currentUserRole, setCurrentUserRole] = useState('');
    const [passwordTimeouts, setPasswordTimeouts] = useState({});

    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                setLoading(true);

                // First get the current user to determine their role
                const currentUserResponse = await axios.get('/api/admin/user');
                const userRole = currentUserResponse.data.user.role;
                setCurrentUserRole(userRole);

                // Then fetch all admin users
                const response = await axios.get('/api/admin/users');
                setAdmins(response.data.users);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch admin users. Please try again later.');
                setLoading(false);
                console.error('Error fetching admins:', err);
            }
        };

        fetchAdmins();
    }, []);

    const togglePasswordVisibility = (adminId) => {
        // Clear any existing timeout for this admin
        if (passwordTimeouts[adminId]) {
            clearTimeout(passwordTimeouts[adminId]);
        }

        // Show password
        setVisiblePasswords(prev => ({
            ...prev,
            [adminId]: true
        }));

        // Set a new timeout to hide password after 5 seconds
        const timeoutId = setTimeout(() => {
            setVisiblePasswords(prev => ({
                ...prev,
                [adminId]: false
            }));
        }, 5000); // 5 seconds

        // Store the timeout ID
        setPasswordTimeouts(prev => ({
            ...prev,
            [adminId]: timeoutId
        }));
    };

    // Clean up timeouts when component unmounts
    useEffect(() => {
        return () => {
            Object.values(passwordTimeouts).forEach(timeoutId => {
                clearTimeout(timeoutId);
            });
        };
    }, [passwordTimeouts]);

    const formatCreatedDate = (dateString) => {
        const date = new Date(dateString);
        return date.getFullYear().toString();
    };

    if (loading) {
        return <div className="flex justify-center items-center h-64">Loading admins...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Admin Users</h1>
                <button
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    onClick={() => window.location.href = '/admin/users/create'}
                >
                    Add New Admin
                </button>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                        </th>
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Admin Since
                        </th>
                        {currentUserRole === 'superadmin' && (
                            <th scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Password
                            </th>
                        )}
                        <th scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {admins.map((admin) => (
                        <tr key={admin.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    {admin.profile_image ? (
                                        <img
                                            className="h-10 w-10 rounded-full mr-3"
                                            src={admin.profile_image}
                                            alt={`${admin.name}'s profile`}
                                        />
                                    ) : (
                                        <div
                                            className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                                            <span className="text-lg text-gray-600">{admin.name.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {admin.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${admin.role === 'superadmin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                    {admin.role}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {formatCreatedDate(admin.created_at)}
                            </td>
                            {currentUserRole === 'superadmin' && (
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <span className="mr-2">
                                            {visiblePasswords[admin.id] ? admin.password_raw : '••••••••'}
                                        </span>
                                        <button
                                            onClick={() => togglePasswordVisibility(admin.id)}
                                            className="text-gray-600 hover:text-gray-900"
                                            title={visiblePasswords[admin.id] ? "Hide password" : "Show password"}
                                        >
                                            {visiblePasswords[admin.id] ? <EyeOff size={16}/> : <Eye size={16}/>}
                                        </button>
                                    </div>
                                </td>
                            )}
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <a href={`/admin/users/edit/${admin.id}`}
                                   className="text-indigo-600 hover:text-indigo-900 mr-4">
                                    Edit
                                </a>
                                {currentUserRole === 'superadmin' && (
                                    <button
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => {
                                            if (window.confirm('Are you sure you want to delete this admin?')) {
                                                // Delete admin API call would go here
                                                axios.delete(`/api/admin/users/${admin.id}`)
                                                    .then(response => {
                                                        if (response.data.success) {
                                                            // Remove the deleted admin from the state
                                                            setAdmins(prevAdmins =>
                                                                prevAdmins.filter(a => a.id !== admin.id)
                                                            );
                                                        }
                                                    })
                                                    .catch(err => {
                                                        console.error('Error deleting admin:', err);
                                                        alert('Failed to delete admin. Please try again.');
                                                    });
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminList;
