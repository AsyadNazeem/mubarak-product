import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Award, Check, CheckCircle, Clock, Heart, Map, Star } from "lucide-react";
import axios from "axios"; // Make sure axios is installed
import group from "../assets/ProductImages/group-red.png";

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Testimonials data (static)
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            text: "Mubarak's fish fry has changed our family dinners. Authentic taste that takes me back to my visit to the Maldives!",
            role: "Food Blogger"
        },
        {
            id: 2,
            name: "Ahmed Hassan",
            text: "As a restaurant owner, I trust Mubarak Products for consistent quality and authentic flavors that my customers love.",
            role: "Restaurant Owner"
        },
        {
            id: 3,
            name: "Leila Patel",
            text: "Their achcharu is simply the best I've ever had. Perfect balance of flavors and incredibly fresh ingredients.",
            role: "Home Chef"
        }
    ];

    // Fetch featured products from database
    useEffect(() => {
        const fetchFeaturedProducts = async () => {
            setLoading(true);
            try {
                const response = await axios.get('/api/v1/products', {
                    params: { featured: 1 } // Only fetch products where featured = 1
                });

                if (response.data.status === 'success') {
                    setFeaturedProducts(response.data.data);
                } else if (response.data.success === true) {
                    // Handle alternate response format
                    setFeaturedProducts(response.data.data);
                }
                setLoading(false);
            } catch (err) {
                console.error("Error fetching featured products:", err);
                setError("Failed to load featured products.");
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    return (
        <div className="text-gray-800">
            {/* Hero Section */}
            <section className="relative h-[calc(100vh-80px)] w-full flex items-center overflow-hidden">
                {/* Background image container that covers the full screen with gradient overlay */}
                <div className="absolute inset-0 w-full h-full">
                    {/* The product image with responsive positioning */}
                    <div
                        className="absolute inset-0 bg-cover bg-center md:bg-left lg:bg-bottom"
                        style={{backgroundImage: `url(${group})`}}
                    ></div>

                    {/* Gradient overlay - adjusted for better mobile visibility */}
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-[#912923]/70 to-[#912923] md:from-transparent md:via-[#912923]/80 md:to-[#912923]"
                    ></div>
                </div>

                {/* Content container - centered on mobile, right-aligned on desktop */}
                <div
                    className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center md:justify-end">
                    <div className="w-full md:w-3/4 lg:w-1/2 text-center md:text-left md:ml-auto">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight mb-4 md:mb-6 drop-shadow-lg">
                            Authentic Maldivian Flavors For Your Table
                        </h1>

                        <p className="text-base md:text-lg lg:text-xl text-gray-100 mb-6 md:mb-8">
                            Experience the vibrant taste of the Maldives with{" "}
                            <span className="text-[#F8E9E0] font-semibold">Mubarak Products</span> —
                            crafted with care for homes and restaurants alike.
                        </p>

                        <div
                            className="flex flex-col sm:flex-row justify-center md:justify-start gap-3 md:gap-4 mb-6 md:mb-8">
                            <button
                                className="bg-[#D62B31] hover:bg-[#B42028] text-white text-base md:text-lg px-6 md:px-8 py-2 md:py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300">
                                Shop Products
                            </button>
                            <button
                                className="bg-transparent border-2 border-white hover:border-[#F8E9E0] text-white hover:text-[#F8E9E0] text-base md:text-lg px-6 md:px-8 py-2 md:py-3 rounded-full font-medium transition duration-300">
                                Learn More
                            </button>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3 mt-4">
                            <div
                                className="bg-white/10 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center">
                                <Award size={14} className="text-[#F8E9E0] mr-1 md:mr-2"/>
                                <span className="text-white text-xs md:text-sm">Premium Quality</span>
                            </div>
                            <div
                                className="bg-white/10 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center">
                                <Check size={14} className="text-[#F8E9E0] mr-1 md:mr-2"/>
                                <span className="text-white text-xs md:text-sm">100% Halal</span>
                            </div>
                            <div
                                className="bg-white/10 backdrop-blur-sm px-3 py-1 md:px-4 md:py-2 rounded-full flex items-center">
                                <Map size={14} className="text-[#F8E9E0] mr-1 md:mr-2"/>
                                <span className="text-white text-xs md:text-sm">Island Authentic</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll indicator */}
                <a
                    href="#features"
                    className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce"
                >
                    <svg
                        className="w-5 h-5 md:w-6 md:h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        ></path>
                    </svg>
                </a>
            </section>

            <div className="max-w-screen-xl mx-auto">
                {/* Features Section */}
                <section id="features" className="py-20 px-6 bg-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#912923] mb-4">Why Choose Mubarak Products?</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Our commitment to quality, tradition and customer satisfaction sets us apart.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            <div
                                className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100">
                                <div
                                    className="bg-[#F8E9E0]/50 text-[#912923] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={32}/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
                                <p className="text-gray-600">
                                    We source only the finest ingredients and follow strict quality control standards.
                                </p>
                            </div>

                            <div
                                className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100">
                                <div
                                    className="bg-[#F8E9E0]/50 text-[#912923] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                    <Heart size={32}/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Traditional Recipes</h3>
                                <p className="text-gray-600">
                                    Our recipes are passed down through generations, preserving authentic Maldivian
                                    flavors.
                                </p>
                            </div>

                            <div
                                className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100">
                                <div
                                    className="bg-[#F8E9E0]/50 text-[#912923] rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                    <Clock size={32}/>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800 mb-3">Fast Delivery</h3>
                                <p className="text-gray-600">
                                    We ensure your orders reach you quickly and in perfect condition, every time.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-20 px-6 bg-gray-50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-[#912923] mb-4">Featured Products</h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Discover our best-selling products loved by customers all over the world.
                            </p>
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

                        {/* Featured Products Grid */}
                        {!loading && !error && (
                            <div className="grid md:grid-cols-3 gap-8">
                                {featuredProducts.length > 0 ? (
                                    featuredProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition group"
                                        >
                                            <div className="relative">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-56 object-cover group-hover:scale-105 transition duration-300"
                                                />
                                                <div
                                                    className="absolute top-4 right-4 bg-[#D62B31] text-white px-3 py-1 rounded-full text-sm font-medium">
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
                                                    <span className="text-sm text-gray-500 ml-2">{product.rating}/5</span>
                                                </div>
                                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                                                <p className="text-gray-600 mb-4">{product.description}</p>
                                                <Link
                                                    to={`/products/${product.id}`}
                                                    className="inline-flex items-center text-[#912923] font-semibold hover:text-[#D62B31]"
                                                >
                                                    View Details
                                                    <ArrowRight className="ml-2 w-4 h-4"/>
                                                </Link>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-3 text-center py-12">
                                        <p className="text-xl text-gray-600">No featured products available at the moment.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="text-center mt-12">
                            <Link to="/products">
                                <button
                                    className="bg-[#912923] hover:bg-[#D62B31] text-white px-8 py-3 rounded-full font-medium inline-flex items-center shadow-lg hover:shadow-xl transition">
                                    View All Products
                                    <ArrowRight className="ml-2 w-5 h-5"/>
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-20 px-6 bg-gradient-to-br from-[#912923] to-[#D62B31] text-white">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
                            <p className="text-[#F8E9E0] text-lg max-w-2xl mx-auto">
                                Don't just take our word for it. Here's what our happy customers have to say.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial.id}
                                     className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:transform hover:-translate-y-1 transition duration-300">
                                    <div className="flex items-center mb-6">
                                        <div
                                            className="bg-[#D62B31] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                                            {testimonial.name.charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="font-semibold">{testimonial.name}</h4>
                                            <p className="text-[#F8E9E0] text-sm">{testimonial.role}</p>
                                        </div>
                                    </div>
                                    <p className="text-white italic">"{testimonial.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 px-6 bg-white">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold text-[#912923] mb-6">Ready to Experience Authentic
                            Flavors?</h2>
                        <p className="text-lg text-gray-600 mb-10">
                            Join thousands of satisfied customers and bring the taste of Maldives to your doorstep
                            today.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/products">
                                <button
                                    className="bg-[#D62B31] hover:bg-[#B42028] text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300 w-full">
                                    Shop Now
                                </button>
                            </Link>
                            <Link to="/contact">
                                <button
                                    className="bg-[#912923] hover:bg-[#7A1F1A] text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300 w-full">
                                    Contact Us
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;
