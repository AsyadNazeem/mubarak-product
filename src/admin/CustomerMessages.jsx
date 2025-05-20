import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Mail, AlertCircle } from 'lucide-react';
import axios from 'axios';

const CustomerMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [messagesPerPage] = useState(10);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            // Replace with your actual API endpoint
            const response = await axios.get('/api/admin/contact-messages');
            setMessages(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching messages:', err);
            setError('Failed to load customer messages. Please try again later.');
            // For demo purposes, load mock data if API fails
            setMessages(getMockMessages());
        } finally {
            setLoading(false);
        }
    };

    const getMockMessages = () => {
        // This is mock data for development/demo purposes
        return Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            full_name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`,
            phone: i % 3 === 0 ? null : `+1234567890${i}`,
            subject: i % 4 === 0 ? 'Product Inquiry' :
                i % 4 === 1 ? 'Feedback' :
                    i % 4 === 2 ? 'Support Request' : 'General Question',
            message: `This is a sample customer message ${i + 1}. It contains the content of the customer's message which can be quite lengthy in some cases and may contain details about their inquiry, feedback, or issues they're experiencing.`,
            newsletter: i % 2 === 0,
            created_at: new Date(2025, 4, 18 - i).toISOString(),
            updated_at: new Date(2025, 4, 18 - i).toISOString(),
            read: i % 3 === 0,
        }));
    };

    // Handle viewing a message
    const handleViewMessage = (message) => {
        setSelectedMessage(message);

        // If we had an API for marking messages as read:
        // if (!message.read) {
        //     markAsRead(message.id);
        // }
    };

    // Handle marking a message as read (would connect to API)
    const markAsRead = async (id) => {
        try {
            // API call would go here
            // await axios.patch(`/api/admin/contact-messages/${id}/read`);

            // For now, just update the UI
            setMessages(messages.map(msg =>
                msg.id === id ? { ...msg, read: true } : msg
            ));
        } catch (err) {
            console.error('Error marking message as read:', err);
        }
    };

    // Filter messages based on search term
    const filteredMessages = messages.filter(message =>
        message.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Get current messages for pagination
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);

    // Format date to a more readable format
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Calculate total pages for pagination
    const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

    return (
        <div className="h-full flex flex-col">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Customer Messages</h2>
                <p className="text-gray-600">View and manage messages from your customers.</p>
            </div>

            {/* Search and Refresh */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div className="relative flex-1 max-w-md">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                </div>
                <button
                    onClick={fetchMessages}
                    className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                    <RefreshCw size={18} className="mr-2" />
                    Refresh
                </button>
            </div>

            {/* Error message */}
            {error && (
                <div className="flex items-center p-4 mb-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    <AlertCircle size={20} className="mr-2" />
                    {error}
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
                </div>
            ) : (
                <div className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
                    {/* Message list */}
                    <div className="w-full md:w-1/3 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                        {currentMessages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                                <Mail size={48} className="mb-4 opacity-30" />
                                <p className="text-center">No messages found</p>
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {currentMessages.map((message) => (
                                    <li key={message.id}>
                                        <button
                                            onClick={() => handleViewMessage(message)}
                                            className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                                                selectedMessage?.id === message.id ? 'bg-red-50 border-l-4 border-red-500' :
                                                    message.read ? '' : 'font-semibold bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-medium truncate">
                                                    {message.full_name}
                                                </h4>
                                                <span className="text-xs text-gray-500">
                                                    {formatDate(message.created_at)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 truncate">{message.subject}</p>
                                            <p className="text-xs text-gray-500 truncate">{message.message}</p>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Message details */}
                    <div className="flex-1 border border-gray-200 rounded-lg bg-white p-6">
                        {selectedMessage ? (
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-xl font-semibold">{selectedMessage.subject}</h3>
                                    <span className="text-sm text-gray-500">{formatDate(selectedMessage.created_at)}</span>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                                    <div className="flex items-center mb-3">
                                        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-medium">
                                            {selectedMessage.full_name.charAt(0)}
                                        </div>
                                        <div className="ml-3">
                                            <p className="font-medium">{selectedMessage.full_name}</p>
                                            <p className="text-sm text-gray-600">{selectedMessage.email}</p>
                                        </div>
                                    </div>
                                    {selectedMessage.phone && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-medium">Phone:</span> {selectedMessage.phone}
                                        </p>
                                    )}
                                    <p className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Newsletter:</span> {selectedMessage.newsletter ? 'Subscribed' : 'Not subscribed'}
                                    </p>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium mb-2">Message:</h4>
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>

                                {/* Action buttons would go here (reply, mark as spam, delete, etc.) */}
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                                        Delete
                                    </button>
                                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500">
                                <Mail size={64} className="mb-4 opacity-30" />
                                <p>Select a message to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-6">
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setCurrentPage(1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            First
                        </button>
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Prev
                        </button>
                        <span className="px-3 py-1 bg-red-600 text-white rounded-md">
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Next
                        </button>
                        <button
                            onClick={() => setCurrentPage(totalPages)}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Last
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerMessages;
