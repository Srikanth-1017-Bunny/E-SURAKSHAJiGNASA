import React from 'react';
import { FaRecycle, FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white pt-20 border-t border-gray-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <FaRecycle className="text-xl" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-xl leading-none text-emerald-900">E-Suraksha</span>
                                <span className="text-xs font-medium tracking-wider text-emerald-700">GREEN TECH SOLUTIONS</span>
                            </div>
                        </Link>
                        <p className="text-gray-500 leading-relaxed mb-6">
                            Your trusted partner for responsible e-waste management. Secure, sustainable, and rewarding.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-500 hover:text-white transition-all">
                                <FaFacebook />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-500 hover:text-white transition-all">
                                <FaTwitter />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-500 hover:text-white transition-all">
                                <FaInstagram />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-emerald-500 hover:text-white transition-all">
                                <FaLinkedin />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Platform</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><Link to="/" className="hover:text-emerald-600 transition">Home</Link></li>
                            <li><a href="#about" className="hover:text-emerald-600 transition">About Us</a></li>
                            <li><a href="#features" className="hover:text-emerald-600 transition">Solutions</a></li>
                            <li><Link to="/signup" className="hover:text-emerald-600 transition">Join as Collector</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li><a href="#" className="hover:text-emerald-600 transition">Impact Reports</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition">Careers</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-emerald-600 transition">Terms of Service</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Contact</h4>
                        <ul className="space-y-4 text-gray-500">
                            <li>123 Green Earth Ave, Tech City, India</li>
                            <li>support@e-suraksha.com</li>
                            <li>+91 98765 43210</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-100 py-8 text-center text-gray-400 text-sm">
                    © 2026 E-Suraksha: Green Tech Solutions. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
