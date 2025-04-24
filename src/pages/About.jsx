import React from "react";
import { Anchor, Heart, Shell, Award, Fish, Users, Leaf } from "lucide-react";

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#328E6E] to-[#67AE6E] text-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About Mubarak Products</h1>
                    <p className="text-lg md:text-xl text-[#E1EEBC] max-w-2xl">
                        A family-owned business delivering authentic Maldivian flavors since 2005.
                    </p>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-[#328E6E] mb-6">Our Story</h2>
                        <p className="text-gray-600 mb-4">
                            Mubarak Products began as a small family kitchen operation in Malé, where our founder,
                            Aisha Mubarak, prepared traditional Maldivian fish products using recipes passed down through generations.
                        </p>
                        <p className="text-gray-600 mb-4">
                            What started as a passion to preserve authentic Maldivian culinary traditions has grown into
                            a beloved brand known throughout the islands and beyond. Our journey from a small kitchen to
                            a respected food producer reflects our unwavering commitment to quality and authenticity.
                        </p>
                        <p className="text-gray-600">
                            Today, while we embrace modern production techniques, we remain true to our roots –
                            each product still carries the distinctive taste that made our family recipes special.
                        </p>
                    </div>
                    <div className="bg-[#E1EEBC]/20 rounded-xl p-6 shadow-inner">
                        <div className="bg-white rounded-lg shadow-md p-6 relative">
                            <div className="absolute -top-6 -left-6 bg-[#328E6E] rounded-full p-4 shadow-lg">
                                <Anchor size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#328E6E] mb-3 mt-2">Our Heritage</h3>
                            <p className="text-gray-600">
                                Rooted in the rich maritime culture of the Maldives, our products celebrate the
                                archipelago's deep connection to the ocean and its bounty. Every jar and package
                                carries with it centuries of island tradition.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="bg-gradient-to-br from-[#E1EEBC]/20 to-[#90C67C]/20 py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl font-bold text-[#328E6E] mb-8 text-center">Our Core Values</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="bg-[#E1EEBC]/50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Heart size={24} className="text-[#328E6E]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Passion for Tradition</h3>
                            <p className="text-gray-600">
                                We preserve authentic recipes and preparation methods that have been passed down through generations.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="bg-[#E1EEBC]/50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Shell size={24} className="text-[#328E6E]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Ocean Sustainability</h3>
                            <p className="text-gray-600">
                                We're committed to responsible sourcing practices that protect our oceans for future generations.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-md text-center">
                            <div className="bg-[#E1EEBC]/50 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <Award size={24} className="text-[#328E6E]" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality Assurance</h3>
                            <p className="text-gray-600">
                                We never compromise on ingredients or preparation methods, ensuring excellence in every product.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Our Products Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-[#328E6E] mb-4">Our Premium Products</h2>
                    <p className="text-gray-600 max-w-3xl mx-auto">
                        We take pride in our range of authentic Maldivian specialties, prepared with the finest ingredients and traditional methods.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-48 bg-[#E1EEBC]/30 flex items-center justify-center">
                            <Fish size={64} className="text-[#328E6E]" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Dried Fish Products</h3>
                            <p className="text-gray-600">
                                Our signature dried fish products, including traditional Maldivian rihaakuru (fish paste) and dry fish,
                                preserved using time-honored techniques.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-48 bg-[#E1EEBC]/30 flex items-center justify-center">
                            <Leaf size={64} className="text-[#67AE6E]" />
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Traditional Chutneys</h3>
                            <p className="text-gray-600">
                                Flavorful chutneys made from local ingredients, perfect accompaniments to enhance any meal with authentic island taste.
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="h-48 bg-[#E1EEBC]/30 flex items-center justify-center">
                            <div className="text-[#90C67C] text-6xl font-bold">A</div>
                        </div>
                        <div className="p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">Achcharu Varieties</h3>
                            <p className="text-gray-600">
                                Our selection of pickled fruits and vegetables, prepared in the distinctive Maldivian style with a perfect balance of flavors.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-[#328E6E] text-white py-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                        <p className="text-[#E1EEBC] max-w-3xl mx-auto">
                            Behind every jar of Mubarak Products is a dedicated team committed to excellence.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="bg-[#67AE6E] rounded-xl shadow-lg p-8 max-w-3xl">
                            <div className="flex flex-col md:flex-row items-center">
                                <div className="bg-[#90C67C] rounded-full p-6 mb-6 md:mb-0 md:mr-8">
                                    <Users size={48} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold mb-4">A Family-Led Enterprise</h3>
                                    <p className="text-white mb-4">
                                        The Mubarak family continues to lead our company, ensuring that every product meets
                                        the high standards set by our founder. Working alongside them is a team of skilled
                                        food artisans, many of whom have been with us for decades.
                                    </p>
                                    <p className="text-[#E1EEBC]">
                                        Together, we form a close-knit community dedicated to sharing the flavors of the
                                        Maldives with the world while preserving our culinary heritage.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Certifications Section */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center aspect-square">
                                <div className="text-center">
                                    <div className="text-[#328E6E] font-bold text-xl mb-1">HALAL</div>
                                    <div className="text-gray-600 text-sm">Certified</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center aspect-square">
                                <div className="text-center">
                                    <div className="text-[#67AE6E] font-bold text-xl mb-1">ISO</div>
                                    <div className="text-gray-600 text-sm">22000:2018</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center aspect-square">
                                <div className="text-center">
                                    <div className="text-[#90C67C] font-bold text-xl mb-1">HACCP</div>
                                    <div className="text-gray-600 text-sm">Compliant</div>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center aspect-square">
                                <div className="text-center">
                                    <div className="text-[#328E6E] font-bold text-xl mb-1">MFD</div>
                                    <div className="text-gray-600 text-sm">Approved</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <h2 className="text-3xl font-bold text-[#328E6E] mb-6">Our Certifications</h2>
                        <p className="text-gray-600 mb-4">
                            At Mubarak Products, we maintain the highest standards of food safety and quality.
                            Our production facilities have earned key industry certifications, reflecting our
                            commitment to excellence.
                        </p>
                        <p className="text-gray-600">
                            From Halal certification to ISO standards compliance, we ensure that our products
                            not only taste exceptional but are prepared according to international safety and
                            quality benchmarks.
                        </p>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-[#67AE6E] to-[#328E6E] text-white py-16 px-6">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-6">Taste the Authentic Flavors of the Maldives</h2>
                    <p className="text-lg mb-8 max-w-3xl mx-auto">
                        Experience our premium range of traditional Maldivian products and bring the taste of the islands to your table.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="bg-white text-[#328E6E] hover:bg-[#E1EEBC] font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition">
                            Explore Our Products
                        </button>
                        <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#328E6E] font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition">
                            Contact Us
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
