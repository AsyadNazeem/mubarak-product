import React, { useState, useEffect } from "react";
import { ShoppingCart, Filter, ChevronDown, Star } from "lucide-react";
import axios from "axios"; // Make sure to install axios: npm install axios

const Products = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState(["All"]);
    const [activeCategory, setActiveCategory] = useState("All");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch categories when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get('/api/v1/categories');
                if (response.data.status === 'success') {
                    setCategories(response.data.data);
                } else if (response.data.success === true) {
                    // Handle the alternate response format
                    // Make sure to preserve "All" as the first option if it's not in the response
                    const responseCategories = response.data.data;
                    if (!responseCategories.includes("All")) {
                        setCategories(["All", ...responseCategories]);
                    } else {
                        setCategories(responseCategories);
                    }
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError("Failed to load categories. Please try again later.");
            }
        };

        fetchCategories();
    }, []);

    // Fetch products when component mounts or category changes
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/v1/products', {
                    params: { category: activeCategory }
                });
                if (response.data.status === 'success') {
                    setProducts(response.data.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again later.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#912923] to-[#D62B31] text-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Products</h1>
                    <p className="text-lg md:text-xl text-[#F8E9E0] max-w-2xl">
                        Discover our range of authentic Maldivian delicacies, crafted with care and tradition.
                    </p>
                </div>
            </div>

            {/* Filters and Products */}
            <section className="max-w-7xl mx-auto px-6 py-12">
                {/* Filters */}
                <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Browse Our Collection</h2>
                        <p className="text-gray-600">
                            High-quality, authentic and delicious products delivered with care.
                        </p>
                    </div>

                    {/* Mobile Filter Button */}
                    <div className="mt-4 md:hidden w-full">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="w-full flex items-center justify-between bg-white p-3 rounded-lg shadow border border-gray-200"
                        >
                            <span className="flex items-center">
                                <Filter size={18} className="mr-2 text-[#912923]" />
                                Filter by: {activeCategory}
                            </span>
                            <ChevronDown size={18} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isFilterOpen && (
                            <div className="mt-2 bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                                {categories.map(category => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setActiveCategory(category);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`block w-full text-left px-4 py-3 hover:bg-gray-50 transition ${
                                            activeCategory === category ? 'bg-[#F8E9E0]/30 text-[#912923] font-medium' : ''
                                        }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Desktop Filters */}
                    <div className="hidden md:flex bg-white rounded-full shadow-md p-1 mt-4 md:mt-0">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-5 py-2 rounded-full transition ${
                                    activeCategory === category
                                        ? 'bg-[#912923] text-white font-medium'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#912923]"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-center py-12">
                        <p className="text-xl text-red-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-[#912923] hover:bg-[#D62B31] text-white px-6 py-2 rounded-full"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 group"
                            >
                                <div className="relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-60 object-cover group-hover:scale-105 transition duration-300"
                                    />
                                    {product.bestseller && (
                                        <div className="absolute top-4 left-4 bg-[#D62B31] text-white px-3 py-1 rounded-full text-sm font-medium">
                                            Bestseller
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-[#912923] text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {product.price}
                                    </div>
                                </div>

                                <div className="p-6">
                                    <div className="flex items-center mb-2">
                                        <div className="flex text-[#D62B31]">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`}
                                                />
                                            ))}
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">{product.rating}</span>
                                    </div>

                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-gray-600 mb-6">{product.description}</p>

                                    <div className="flex justify-between items-center">
                                        <span className="text-[#912923] font-medium">{product.category}</span>
                                        <button className="bg-[#D62B31] hover:bg-[#912923] text-white rounded-full p-3 transition">
                                            <ShoppingCart size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {!loading && !error && products.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-2xl text-gray-600">No products found in this category.</p>
                        <button
                            onClick={() => setActiveCategory("All")}
                            className="mt-4 bg-[#912923] hover:bg-[#D62B31] text-white px-6 py-2 rounded-full text-sm"
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-br from-[#F8E9E0]/30 to-[#D62B31]/20 py-16 px-6">
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#912923] mb-6">Can't find what you're looking for?</h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        We regularly update our product selection. Contact us for special orders or bulk purchases.
                    </p>
                    <button className="bg-[#912923] hover:bg-[#D62B31] text-white px-8 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition">
                        Contact Us
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Products;
