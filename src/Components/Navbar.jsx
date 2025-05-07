import {useState} from "react";
import {Link} from "react-router-dom";
import {Menu, X} from "lucide-react";
import logo from "../assets/ProductImages/logo.png"; // Adjust the path as needed

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        {name: "Home", path: "/"},
        {name: "Products", path: "/products"},
        {name: "About", path: "/about"},
        {name: "Contact", path: "/contact"},
    ];

    return (
        <nav className="bg-[#D62B31] text-white shadow-lg sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-3 group">
                    <img
                        src={logo}
                        alt="Mubarak Products Logo"
                        className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <span
                        className="text-xl font-semibold text-white group-hover:text-[#F8E9E0] transition duration-300">
                        Mubarak Products
                    </span>
                </Link>

                <div className="hidden md:flex items-center space-x-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="font-medium hover:text-[#F8E9E0] transition duration-300 relative after:absolute after:bottom-[-5px] after:left-0 after:h-[2px] after:w-0 after:bg-[#F8E9E0] after:transition-all hover:after:w-full"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button
                        className="bg-[#912923] hover:bg-[#7A1F1A] font-medium px-5 py-2 rounded-full text-sm shadow-md hover:shadow-lg transition duration-300">
                        Shop Now
                    </button>
                </div>

                <div className="md:hidden">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-full hover:bg-[#912923] transition"
                    >
                        {isOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>
                </div>
            </div>

            {isOpen && (
                <div
                    className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-4 bg-[#D62B31] text-white border-t border-[#912923]">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            to={link.path}
                            className="hover:text-[#F8E9E0] py-2 font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <button
                        className="bg-[#912923] hover:bg-[#7A1F1A] w-full font-medium py-3 rounded-full text-sm shadow-md hover:shadow-lg transition duration-300 mt-2">
                        Shop Now
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
