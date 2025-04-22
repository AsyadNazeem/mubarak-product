import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-gray-300">
            <div className="max-w-7xl mx-auto pt-16 pb-8 px-6">
                {/* Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Company Info */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Mubarak Products</h3>
                        <p className="text-gray-400 mb-4">
                            Bringing authentic Maldivian flavors to your table with our premium fish products, chutneys, and traditional delicacies.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-green-400 transition">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-green-400 transition">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-green-400 transition">Home</Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-400 hover:text-green-400 transition">Products</Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-400 hover:text-green-400 transition">About Us</Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-green-400 transition">Contact</Link>
                            </li>
                            <li>
                                <Link to="#" className="text-gray-400 hover:text-green-400 transition">FAQs</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin size={20} className="text-green-400 flex-shrink-0 mt-1" />
                                <span className="text-gray-400">123 Seafood Lane, Malé, Maldives</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone size={20} className="text-green-400 flex-shrink-0" />
                                <span className="text-gray-400">+960 123-4567</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail size={20} className="text-green-400 flex-shrink-0" />
                                <span className="text-gray-400">info@mubarakproducts.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
                    <p>&copy; {new Date().getFullYear()} Mubarak Products. All rights reserved.</p>
                    <div className="mt-2">
                        <a href="#" className="text-gray-500 hover:text-green-400 mx-2 transition">Privacy Policy</a>
                        <span className="text-gray-700">|</span>
                        <a href="#" className="text-gray-500 hover:text-green-400 mx-2 transition">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
