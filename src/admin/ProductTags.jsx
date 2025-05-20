
import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X, Tag } from 'lucide-react';

const ProductTags = () => {
    // Sample initial tags data
    const initialTags = [
        { id: 1, name: 'New Arrival', slug: 'new-arrival', products: 12 },
        { id: 2, name: 'Featured', slug: 'featured', products: 24 },
        { id: 3, name: 'Sale', slug: 'sale', products: 18 },
        { id: 4, name: 'Bestseller', slug: 'bestseller', products: 32 },
        { id: 5, name: 'Limited Edition', slug: 'limited-edition', products: 7 },
    ];

    const [tags, setTags] = useState(initialTags);
    const [searchTerm, setSearchTerm] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [currentTag, setCurrentTag] = useState({ id: null, name: '', slug: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);

    // Filter tags based on search term
    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Generate slug from tag name
    const generateSlug = (name) => {
        return name.toLowerCase().replace(/\s+/g, '-');
    };

    // Handle input change for tag form
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setCurrentTag({
                ...currentTag,
                name: value,
                slug: generateSlug(value)
            });
        } else {
            setCurrentTag({
                ...currentTag,
                [name]: value
            });
        }
    };

    // Open modal to add new tag
    const openAddModal = () => {
        setCurrentTag({ id: null, name: '', slug: '' });
        setIsEditing(false);
        setModalOpen(true);
    };

    // Open modal to edit existing tag
    const openEditModal = (tag) => {
        setCurrentTag({ ...tag });
        setIsEditing(true);
        setModalOpen(true);
    };

    // Save tag (create or update)
    const saveTag = () => {
        if (currentTag.name.trim() === '') return;

        if (isEditing) {
            // Update existing tag
            setTags(tags.map(tag =>
                tag.id === currentTag.id ? { ...currentTag } : tag
            ));
        } else {
            // Create new tag with a new ID
            const newId = Math.max(...tags.map(tag => tag.id), 0) + 1;
            const newTag = {
                ...currentTag,
                id: newId,
                products: 0 // New tag has no products
            };
            setTags([...tags, newTag]);
        }

        setModalOpen(false);
    };

    // Open delete confirmation
    const openDeleteConfirm = (id) => {
        setConfirmDeleteId(id);
    };

    // Delete tag
    const deleteTag = () => {
        setTags(tags.filter(tag => tag.id !== confirmDeleteId));
        setConfirmDeleteId(null);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Product Tags</h2>
                <p className="text-gray-600">Manage product tags to organize your inventory</p>
            </div>

            {/* Search and Add New Tag */}
            <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
                <div className="relative max-w-xs w-full">
                    <input
                        type="text"
                        placeholder="Search tags..."
                        className="pl-10 pr-4 py-2 border text-black border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center px-4 py-2 bg-[#D62B31] text-white rounded-lg hover:bg-[#912923] transition"
                >
                    <Plus size={18} className="mr-2" />
                    Add New Tag
                </button>
            </div>

            {/* Tags Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredTags.length > 0 ? (
                        filteredTags.map(tag => (
                            <tr key={tag.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Tag size={16} className="text-[#D62B31] mr-2" />
                                        <span className="text-sm font-medium text-gray-900">{tag.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tag.slug}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">{tag.products}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => openEditModal(tag)}
                                            className="p-1 text-blue-600 hover:text-blue-800"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => openDeleteConfirm(tag.id)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">
                                No tags found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Add/Edit Tag Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">
                                {isEditing ? 'Edit Tag' : 'Add New Tag'}
                            </h3>
                            <button
                                onClick={() => setModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tag Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={currentTag.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g. New Arrival"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                                <input
                                    type="text"
                                    name="slug"
                                    value={currentTag.slug}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="e.g. new-arrival"
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    URL-friendly version of the tag name
                                </p>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    onClick={() => setModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={saveTag}
                                    className="px-4 py-2 bg-[#D62B31] text-white rounded-md hover:bg-[#912923]"
                                >
                                    {isEditing ? 'Update Tag' : 'Add Tag'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {confirmDeleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <div className="text-center">
                            <Tag size={32} className="mx-auto mb-4 text-red-500" />
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Tag</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete this tag? This action cannot be undone.
                            </p>

                            <div className="flex justify-center space-x-3">
                                <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={deleteTag}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductTags;
