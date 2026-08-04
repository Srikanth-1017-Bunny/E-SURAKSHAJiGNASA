import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaRecycle, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '#' },
        { name: 'About', href: '#about' },
        { name: 'Solutions', href: '#features' },
        { name: 'How It Works', href: '#how-it-works' },
        { name: 'Impact', href: '#impact' },
    ];

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                        <FaRecycle className="text-xl animate-spin-slow" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-bold text-xl leading-none ${scrolled ? 'text-gray-800' : 'text-emerald-900'}`}>E-Suraksha</span>
                        <span className={`text-xs font-medium tracking-wider ${scrolled ? 'text-gray-500' : 'text-emerald-700'}`}>GREEN TECH SOLUTIONS</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${scrolled ? 'text-gray-600' : 'text-gray-700'}`}
                        >
                            {link.name}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link
                        to="/login"
                        className={`font-semibold px-4 py-2 rounded-lg transition-colors ${scrolled ? 'text-gray-600 hover:text-emerald-600' : 'text-gray-700 hover:text-emerald-700'}`}
                    >
                        Login
                    </Link>
                    <Link
                        to="/signup"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
                    >
                        Schedule Pickup
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-2xl text-gray-700"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 animate-fadeIn">
                    {navLinks.map((link) => (
                        <a
                            key={link.name}
                            href={link.href}
                            className="text-gray-700 font-semibold py-2 border-b border-gray-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.name}
                        </a>
                    ))}
                    <div className="flex flex-col gap-3 mt-4">
                        <Link to="/login" className="text-center text-gray-700 font-semibold py-2 border border-gray-200 rounded-lg">
                            Login
                        </Link>
                        <Link to="/signup" className="text-center bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-lg">
                            Schedule Pickup
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
