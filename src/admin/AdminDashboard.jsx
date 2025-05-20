import React, { useState, useEffect } from 'react';
import {
    Menu, X, Home, Package, ShoppingCart, Users, Settings,
    Bell, ChevronDown, LogOut, User, BarChart3, CreditCard,
    MessageSquare, HelpCircle, ChevronRight, Layers, Tag,
    ListChecks, FileText, PieChart, CreditCard as CardIcon,
    Calendar, UserPlus, Database, Inbox, BookOpen, Wrench, Key
} from 'lucide-react';
import { useAuth } from "../context/AuthContext.jsx";
import { ADMIN_PATH } from '../context/constants';
import { useNavigate } from "react-router-dom";
import CategoryForm from "../admin/CategoryForm.jsx";
import SubCategoryForm from "../admin/SubCategoryForm.jsx";
import ProductRegister from "../admin/ProductRegister.jsx";
import ProductTags from "../admin/ProductTags.jsx";
import CustomerMessages from "../admin/CustomerMessages.jsx";
import AdminRegisterForm from "../admin/AdminRegisterForm.jsx";
import Profile from "../admin/Profile.jsx";
import ChangePassword from "../admin/ChangePassword.jsx";
import AdminList from "../admin/AdminList.jsx";

const AdminDashboard = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    // State to track which sidebar items are expanded
    const [expandedItems, setExpandedItems] = useState({});
    // State to track which content to display
    const [activeContent, setActiveContent] = useState('dashboard');
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    // Get the current user from AuthContext
    const { admin, logout } = useAuth();

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    // Toggle expanded state for sidebar items
    // Only one menu can be expanded at a time
    const toggleExpand = (itemName) => {
        setExpandedItems(prev => {
            // If this item is already expanded, collapse it
            if (prev[itemName]) {
                return {
                    ...prev,
                    [itemName]: false
                };
            }

            // Otherwise, collapse all items and expand only this one
            const resetItems = {};
            Object.keys(prev).forEach(key => {
                resetItems[key] = false;
            });

            return {
                ...resetItems,
                [itemName]: true
            };
        });
    };

    const navigate = useNavigate();

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
        setProfileDropdownOpen(false); // Close the profile dropdown when showing the confirmation
    };

// 3. Add the actual logout function that will be called after confirmation
    const confirmLogout = async () => {
        await logout();
        // Use React Router's navigate to handle path correctly
        navigate(`${ADMIN_PATH}/login`, { replace: true });
    };
    // Set active content when clicking on a sidebar item
    const handleContentChange = (contentName) => {
        setActiveContent(contentName);
    };

    // Enhanced sidebar items with sub-menus
    const sidebarItems = [
        {
            name: 'Dashboard',
            icon: <Home size={20} />,
            contentKey: 'dashboard',
            hasSubMenu: false
        },
        {
            name: 'Products',
            icon: <Package size={20} />,
            hasSubMenu: true,
            subMenuItems: [
                { name: 'Categories', icon: <Layers size={18} />, contentKey: 'categories' },
                { name: 'Sub Categories', icon: <ListChecks size={18} />, contentKey: 'subcategories' },
                { name: 'Product List', icon: <Package size={18} />, contentKey: 'products' },
                { name: 'Product Tags', icon: <Tag size={18} />, contentKey: 'product-tags' },
                // { name: 'Inventory', icon: <Database size={18} />, contentKey: 'inventory' }
            ]
        },
        {
            name: 'Messages',
            icon: <MessageSquare size={20} />,
            hasSubMenu: true,
            subMenuItems: [
                { name: 'Customer Messages', icon: <Inbox size={18} />, contentKey: 'customer-messages' },
            ]
        },
        {
            name: 'Maintenance',
            icon: <Wrench size={20} />,
            hasSubMenu: true,
            subMenuItems: [
                { name: 'Admin Register', icon: <UserPlus size={18} />, contentKey: 'admin-register' },
                { name: 'Admin List', icon: <UserPlus size={18} />, contentKey: 'admin-list' }
            ]
        },
        {
            name: 'Support',
            icon: <HelpCircle size={20} />,
            hasSubMenu: true,
            subMenuItems: [
                { name: 'Tickets', icon: <Inbox size={18} />, contentKey: 'tickets' },
                { name: 'Knowledge Base', icon: <BookOpen size={18} />, contentKey: 'knowledge-base' },
                { name: 'FAQs', icon: <HelpCircle size={18} />, contentKey: 'faqs' },
            ]
        },
        {
            name: 'Settings',
            icon: <Settings size={20} />,
            contentKey: 'settings',
            hasSubMenu: true,
            subMenuItems: [
                { name: 'Profile', icon: <User size={18} />, contentKey: 'profile' },
                { name: 'Change Password', icon: <Key size={18} />, contentKey: 'change-password' }
            ]
        },
    ];

    // Render different content based on activeContent state
    const renderContent = () => {
        switch (activeContent) {
            case 'categories':
                return <CategoryForm />;
            case 'subcategories':
                return <SubCategoryForm />;
            case 'products':
                return <ProductRegister />;
            case 'product-tags':
                return <ProductTags />;
            case 'customer-messages':
                return <CustomerMessages />;
            case 'admin-register':
                return <AdminRegisterForm />;
            case 'admin-list':
                return <AdminList />;
            case 'profile':
                return <Profile />;
            case 'change-password':
                return <ChangePassword />;
            case 'dashboard':
            default:
                return (
                    <>
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Welcome, {admin?.name || 'Admin'}</h2>
                            <p className="text-gray-600">Here's what's happening with your store today.</p>
                        </div>

                        {/* Dashboard Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Total Sales</h3>
                                    <ShoppingCart size={24} className="text-[#D62B31]" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">$14,325</p>
                                <p className="text-green-600 text-sm mt-2">+12% from last week</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-700">New Orders</h3>
                                    <Package size={24} className="text-[#D62B31]" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">43</p>
                                <p className="text-green-600 text-sm mt-2">+5% from yesterday</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-700">New Customers</h3>
                                    <Users size={24} className="text-[#D62B31]" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">18</p>
                                <p className="text-green-600 text-sm mt-2">+3% from last week</p>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-gray-700">Total Products</h3>
                                    <Package size={24} className="text-[#D62B31]" />
                                </div>
                                <p className="text-3xl font-bold text-gray-800">127</p>
                                <p className="text-gray-600 text-sm mt-2">2 added today</p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#ORD-7352</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Sarah Johnson</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">May 07, 2025</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">$120.00</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Delivered</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#ORD-7351</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Michael Brown</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">May 07, 2025</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">$85.50</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Processing</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#ORD-7350</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">David Wilson</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">May 06, 2025</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">$235.25</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Shipped</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#ORD-7349</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Jessica Smith</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">May 06, 2025</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">$75.00</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Delivered</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">#ORD-7348</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">Robert Garcia</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">May 05, 2025</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">$320.75</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Cancelled</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`bg-[#D62B31] text-white transition-all duration-300 ${
                    sidebarOpen ? 'w-64' : 'w-20'
                } flex flex-col`}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between p-4 border-b border-[#912923]">
                    {sidebarOpen && (
                        <span className="text-xl font-bold text-white">Mubarak Admin</span>
                    )}
                    <button
                        onClick={toggleSidebar}
                        className="p-2 rounded-full hover:bg-[#912923] transition"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Sidebar Menu */}
                <div className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {sidebarItems.map((item) => (
                            <li key={item.name}>
                                {item.hasSubMenu ? (
                                    <div>
                                        <button
                                            onClick={() => toggleExpand(item.name)}
                                            className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-[#912923] transition-all"
                                        >
                                            <div className="flex items-center">
                                                <div className="text-white">{item.icon}</div>
                                                {sidebarOpen && (
                                                    <span className="ml-3 text-white font-medium">{item.name}</span>
                                                )}
                                            </div>
                                            {sidebarOpen && (
                                                <ChevronRight
                                                    size={16}
                                                    className={`transition-transform duration-200 ${
                                                        expandedItems[item.name] ? 'transform rotate-90' : ''
                                                    }`}
                                                />
                                            )}
                                        </button>

                                        {/* Sub Menu Items */}
                                        {sidebarOpen && expandedItems[item.name] && (
                                            <ul className="ml-4 mt-1 space-y-1">
                                                {item.subMenuItems.map((subItem) => (
                                                    <li key={subItem.name}>
                                                        <button
                                                            onClick={() => handleContentChange(subItem.contentKey)}
                                                            className={`flex items-center w-full p-2 rounded-lg hover:bg-[#912923] transition-all ${
                                                                activeContent === subItem.contentKey ? 'bg-[#912923]' : ''
                                                            }`}
                                                        >
                                                            <div className="text-white opacity-75">{subItem.icon}</div>
                                                            <span className="ml-3 text-white text-sm">{subItem.name}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => handleContentChange(item.contentKey)}
                                        className={`flex items-center w-full p-3 rounded-lg hover:bg-[#912923] transition-all ${
                                            activeContent === item.contentKey ? 'bg-[#912923]' : ''
                                        }`}
                                    >
                                        <div className="text-white">{item.icon}</div>
                                        {sidebarOpen && (
                                            <span className="ml-3 text-white font-medium">{item.name}</span>
                                        )}
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="bg-white shadow-md">
                    <div className="flex items-center justify-between px-6 py-4">
                        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>

                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <button className="p-2 rounded-full hover:bg-gray-100 transition relative">
                                <Bell size={20} color="black" />
                                <span className="absolute top-0 right-0 w-4 h-4 bg-[#D62B31] rounded-full text-xs text-white flex items-center justify-center">3</span>
                            </button>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={toggleProfileDropdown}
                                    className="flex items-center space-x-2 p-2 rounded-full text-black hover:bg-gray-100 transition"
                                >
                                    <div className="w-8 h-8 rounded-full bg-[#D62B31] text-white flex items-center justify-center">
                                        {admin?.name?.charAt(0) || 'A'}
                                    </div>
                                    {admin?.name && (
                                        <span className="font-medium text-gray-700">{admin.name}</span>
                                    )}
                                    <ChevronDown size={16} />
                                </button>

                                {profileDropdownOpen && (
                                    <div
                                        className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                                        <button
                                            onClick={() => handleContentChange('profile')}
                                            className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <User size={16} className="mr-2"/>
                                            Profile
                                        </button>
                                        <button
                                            onClick={() => handleContentChange('change-password')}
                                            className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <Settings size={16} className="mr-2"/>
                                            Change Password
                                        </button>
                                        <hr className="my-1 border-gray-200"/>
                                        <button
                                            onClick={handleLogoutClick}
                                            className="flex items-center w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut size={16} className="mr-2"/>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {renderContent()}
                </main>

                {showLogoutConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Logout</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to logout?</p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowLogoutConfirm(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="px-4 py-2 bg-[#D62B31] text-white rounded-md hover:bg-[#912923]"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
