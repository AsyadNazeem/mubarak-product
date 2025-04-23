import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Star, ArrowRight, Clock, Heart } from "lucide-react";

const featuredProducts = [
    {
        id: 1,
        name: "Spicy Maldives Fish Fry",
        description: "Authentic Maldivian taste, made with premium dried fish and spices.",
        image: "./src/assets/ProductImages/Maldives Fish Fry Land.png",
        price: "$12.99",
        rating: 4.8,
    },
    {
        id: 2,
        name: "Traditional Chutney",
        description: "Made with love using age-old recipes passed through generations.",
        image: "./src/assets/ProductImages/Chutney Land1.png",
        price: "$9.99",
        rating: 4.9,
    },
    {
        id: 3,
        name: "Achcharu Delight",
        description: "Tangy, spicy, and addictive. A perfect side for any meal.",
        image: "./src/assets/ProductImages/AchcharuLand.png",
        price: "$8.99",
        rating: 4.7,
    },
];

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

const Home = () => {
    return (
        <div className="text-gray-800">
            {/* Hero Section */}
            <section className="relative min-h-[95vh] flex flex-col justify-center items-center text-center px-6">
                {/* Background with overlay */}
                <div className="absolute inset-0 bg-[url('https://via.placeholder.com/1920x1080?text=Maldivian+Food')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/70"></div>
                </div>

                <div className="relative max-w-3xl z-10">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
                        Authentic Maldivian Flavors For Your Table
                    </h1>

                    <p className="text-lg md:text-xl text-gray-100 mb-10">
                        Experience the vibrant taste of the Maldives with <span className="text-green-300 font-semibold">Mubarak Products</span> — crafted with care for homes and restaurants alike.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                        <Link to="/products">
                            <button className="bg-green-500 hover:bg-green-600 text-white text-lg px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300 w-full">
                                Shop Products
                            </button>
                        </Link>
                        <Link to="/about">
                            <button className="bg-transparent border-2 border-white hover:border-green-300 text-white hover:text-green-300 text-lg px-8 py-4 rounded-full font-medium transition duration-300 w-full">
                                Learn More
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <a href="#features" className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </a>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-blue-800 mb-4">Why Choose Mubarak Products?</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Our commitment to quality, tradition and customer satisfaction sets us apart.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100">
                            <div className="bg-blue-100 text-blue-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Premium Quality</h3>
                            <p className="text-gray-600">
                                We source only the finest ingredients and follow strict quality control standards.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100">
                            <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <Heart size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 mb-3">Traditional Recipes</h3>
                            <p className="text-gray-600">
                                Our recipes are passed down through generations, preserving authentic Maldivian flavors.
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-8 text-center hover:shadow-xl transition duration-300 border border-gray-100">
                            <div className="bg-yellow-100 text-yellow-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                <Clock size={32} />
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
                        <h2 className="text-4xl font-bold text-blue-800 mb-4">Featured Products</h2>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Discover our best-selling products loved by customers all over the world.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {featuredProducts.map((product) => (
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
                                    <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                                        {product.price}
                                    </div>
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center mb-2">
                                        <div className="flex text-yellow-400">
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                            <Star className="w-4 h-4 fill-current" />
                                        </div>
                                        <span className="text-sm text-gray-500 ml-2">{product.rating}/5</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
                                    <p className="text-gray-600 mb-4">{product.description}</p>
                                    <Link
                                        to="/products"
                                        className="inline-flex items-center text-green-600 font-semibold hover:text-green-700"
                                    >
                                        View Details
                                        <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/products">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium inline-flex items-center shadow-lg hover:shadow-xl transition">
                                View All Products
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-6 bg-gradient-to-br from-blue-900 to-blue-700 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
                        <p className="text-blue-100 text-lg max-w-2xl mx-auto">
                            Don't just take our word for it. Here's what our happy customers have to say.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div key={testimonial.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:transform hover:-translate-y-1 transition duration-300">
                                <div className="flex items-center mb-6">
                                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="font-semibold">{testimonial.name}</h4>
                                        <p className="text-blue-200 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>
                                <p className="text-blue-100 italic">"{testimonial.text}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-4xl font-bold text-blue-800 mb-6">Ready to Experience Authentic Flavors?</h2>
                    <p className="text-lg text-gray-600 mb-10">
                        Join thousands of satisfied customers and bring the taste of Maldives to your doorstep today.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/products">
                            <button className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300 w-full">
                                Shop Now
                            </button>
                        </Link>
                        <Link to="/contact">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition duration-300 w-full">
                                Contact Us
                            </button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
