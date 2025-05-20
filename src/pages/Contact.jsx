import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import axios from "axios"; // Make sure to import axios

const Contact = () => {
    // Form state
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
        newsletter: false
    });

    // Form submission states
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    // Form validation
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });

        // Clear error when field is edited
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    // Validate form
    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = "Name is required";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email address is invalid";
        }

        if (!formData.subject) {
            newErrors.subject = "Please select a subject";
        }

        if (!formData.message.trim()) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Connect to Laravel API endpoint
            const response = await axios.post("/api/contact", formData, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (response.status === 201) {
                // Show success message
                setSuccess(true);

                // Reset form after successful submission
                setFormData({
                    fullName: "",
                    email: "",
                    phone: "",
                    subject: "",
                    message: "",
                    newsletter: false
                });

                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccess(false);
                }, 5000);
            } else {
                throw new Error("Unexpected response from server");
            }
        } catch (err) {
            console.error("Form submission error:", err);

            // Handle validation errors from Laravel
            if (err.response && err.response.status === 422) {
                const serverErrors = err.response.data.errors;
                const fieldErrors = {};

                // Map server validation errors to form fields
                Object.keys(serverErrors).forEach(key => {
                    // Map server field names to component field names (if needed)
                    let fieldName = key;
                    if (key === 'full_name') fieldName = 'fullName';

                    fieldErrors[fieldName] = serverErrors[key][0];
                });

                setErrors({...errors, ...fieldErrors});
                setError("Please correct the errors in the form");
            } else {
                setError(err.response?.data?.message || "Something went wrong. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Rest of your Contact component remains the same
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#912923] to-[#D62B31] text-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-lg md:text-xl text-[#F8E9E0] max-w-2xl">
                        We'd love to hear from you. Get in touch with our friendly team.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Contact Information */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-[#912923] mb-6">Contact Information</h2>

                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="bg-[#F8E9E0] text-[#912923] rounded-full p-3 mt-1">
                                        <Phone size={20}/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-800">Call Us</h3>
                                        <p className="text-gray-600 mt-1">+960 123-4567</p>
                                        <p className="text-gray-600">+960 987-6543</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-[#F8E9E0] text-[#912923] rounded-full p-3 mt-1">
                                        <Mail size={20}/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-800">Email Us</h3>
                                        <p className="text-gray-600 mt-1">info@mubarakproducts.com</p>
                                        <p className="text-gray-600">sales@mubarakproducts.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-[#F8E9E0] text-[#912923] rounded-full p-3 mt-1">
                                        <MapPin size={20}/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-800">Visit Us</h3>
                                        <p className="text-gray-600 mt-1">
                                            123 Seafood Lane, <br/>
                                            Malé, Maldives
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start">
                                    <div className="bg-[#F8E9E0] text-[#912923] rounded-full p-3 mt-1">
                                        <Clock size={20}/>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="font-medium text-gray-800">Business Hours</h3>
                                        <p className="text-gray-600 mt-1">Monday - Friday: 9AM - 5PM</p>
                                        <p className="text-gray-600">Saturday: 10AM - 2PM</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <h3 className="font-medium text-gray-800 mb-4">Connect With Us</h3>
                                <div className="flex space-x-4">
                                    <a href="#"
                                       className="bg-[#912923] hover:bg-[#D62B31] text-white p-2 rounded-full transition">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                    </a>
                                    <a href="#"
                                       className="bg-[#D62B31] hover:bg-[#912923] text-white p-2 rounded-full transition">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                        </svg>
                                    </a>
                                    <a href="#"
                                       className="bg-[#F8E9E0] hover:bg-[#F8E9E0]/70 text-[#912923] hover:text-[#D62B31] p-2 rounded-full transition">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-2">
                        <div className="bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-[#912923] mb-6">Send Us a Message</h2>
                            <p className="text-gray-600 mb-8">
                                Have questions about our products or services? Fill out the form below and our team will
                                get back to you as soon as possible.
                            </p>

                            {success ? (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-xl font-medium text-green-800 mb-2">Message Sent Successfully!</h3>
                                    <p className="text-green-700">
                                        Thank you for reaching out to us. We've received your message and will get back to you shortly.
                                    </p>
                                </div>
                            ) : (
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name*
                                            </label>
                                            <input
                                                type="text"
                                                id="fullName"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleChange}
                                                className={`w-full border text-black ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#912923] focus:border-[#912923] transition`}
                                                placeholder="Your Name"
                                            />
                                            {errors.fullName && (
                                                <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                                Email Address*
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className={`w-full border text-black ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#912923] focus:border-[#912923] transition`}
                                                placeholder="your@email.com"
                                            />
                                            {errors.email && (
                                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full border text-black border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#912923] focus:border-[#912923] transition"
                                            placeholder="Your Phone Number (Optional)"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject*
                                        </label>
                                        <select
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className={`w-full border text-black ${errors.subject ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#912923] focus:border-[#912923] transition text-gray-700`}
                                        >
                                            <option value="" disabled>Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="products">Product Information</option>
                                            <option value="orders">Order Status</option>
                                            <option value="wholesale">Wholesale Opportunities</option>
                                            <option value="feedback">Feedback</option>
                                        </select>
                                        {errors.subject && (
                                            <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                            Message*
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows="5"
                                            className={`w-full border text-black ${errors.message ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#912923] focus:border-[#912923] transition`}
                                            placeholder="Your message..."
                                        ></textarea>
                                        {errors.message && (
                                            <p className="mt-1 text-sm text-red-600">{errors.message}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="newsletter"
                                            name="newsletter"
                                            checked={formData.newsletter}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-[#D62B31] text-black border-gray-300 rounded focus:ring-[#D62B31]"
                                        />
                                        <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                                            Subscribe to our newsletter for promotions and updates
                                        </label>
                                    </div>

                                    {error && (
                                        <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className={`${
                                                loading ? 'bg-gray-400' : 'bg-[#D62B31] hover:bg-[#912923]'
                                            } text-white font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition flex items-center justify-center w-full md:w-auto`}
                                        >
                                            {loading ? 'Sending...' : 'Send Message'}
                                            {!loading && <Send size={18} className="ml-2" />}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="bg-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#912923] mb-10 text-center">Find Us</h2>
                    <div className="bg-gray-200 h-96 rounded-xl overflow-hidden shadow-md">
                        <iframe
                            title="Mubarak Products Location"
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{border: 0}}
                            src="https://maps.google.com/maps?q=109%20Circular%20Road%20Galle+(Mubarak%20Products)&z=14&ie=UTF8&iwloc=B&output=embed"
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-gradient-to-br from-[#F8E9E0] to-[#D62B31]/20 py-16 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-[#912923] mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-600 mb-12 max-w-3xl mx-auto">
                        Can't find the answer you're looking for? Contact our team for assistance.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6 text-left">
                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-[#912923] mb-2">What are your delivery options?</h3>
                            <p className="text-gray-600">
                                We offer standard and express delivery throughout the Maldives. International shipping
                                is available for select countries.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-[#912923] mb-2">Are your products halal certified?</h3>
                            <p className="text-gray-600">
                                Yes, all our products are prepared according to halal standards and have proper
                                certification.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-[#912923] mb-2">Do you offer wholesale pricing?</h3>
                            <p className="text-gray-600">
                                Yes, we provide special pricing for bulk orders and business clients. Please contact our
                                sales team for details.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md">
                            <h3 className="font-bold text-lg text-[#912923] mb-2">What is the shelf life of your
                                products?</h3>
                            <p className="text-gray-600">
                                Most of our products have a shelf life of 6-12 months when stored properly. Check
                                individual product packaging for details.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
