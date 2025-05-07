import React, { useState } from "react";
import { ShoppingCart, Filter, ChevronDown, Star } from "lucide-react";
import maldivesFish from '../assets/ProductImages/maldives-fish-fry-land.png';
import chutney from "../assets/ProductImages/chutney-land-new.png";
import achcharu from "../assets/ProductImages/achcharu-land.png";

const products = [
    {
        id: 1,
        name: "Maldives Fish Fry",
        description: "Deliciously spiced and perfectly crispy. Made with authentic Maldivian techniques and premium fish.",
        price: "$12.99",
        image: maldivesFish,
        rating: 4.8,
        category: "Maldives Fish",
        bestseller: true
    },
    {
        id: 2,
        name: "Dry Fruit Chutney",
        description: "Authentic flavor with a family recipe passed down through generations. Perfect with rice or bread.",
        price: "$6.99",
        image: chutney,
        rating: 4.5,
        category: "Condiments",
        bestseller: false
    },
    {
        id: 3,
        name: "Achcharu",
        description: "Tangy, spicy, and preserved to perfection. A delightful mix of vegetables in our signature brine.",
        price: "$8.49",
        image: achcharu,
        rating: 4.9,
        category: "Pickles",
        bestseller: true
    },
    {
        id: 4,
        name: "Premium Maldives Fish",
        description: "Our highest quality dried fish with a rich, smoky flavor. Ideal for gourmet dishes.",
        price: "$15.99",
        image: "https://via.placeholder.com/300x200?text=Premium+Fish",
        rating: 4.7,
        category: "Maldives Fish",
        bestseller: false
    },
    {
        id: 5,
        name: "Coconut Sambol",
        description: "A spicy coconut mixture that makes the perfect side for any meal. Authentically prepared.",
        price: "$7.49",
        image: "https://via.placeholder.com/300x200?text=Coconut+Sambol",
        rating: 4.6,
        category: "Condiments",
        bestseller: false
    },
    {
        id: 6,
        name: "Rihaakuru Paste",
        description: "Traditional Maldivian fish paste with a rich umami flavor. Use sparingly to enhance any dish.",
        price: "$9.99",
        image: "https://via.placeholder.com/300x200?text=Rihaakuru",
        rating: 4.4,
        category: "Maldives Fish",
        bestseller: true
    },
];

const categories = ["All", "Maldives Fish", "Condiments", "Pickles"];

const Products = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const filteredProducts = activeCategory === "All"
        ? products
        : products.filter(product => product.category === activeCategory);

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

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product) => (
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

                {/* No Results */}
                {filteredProducts.length === 0 && (
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
