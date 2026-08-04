import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRecycle, FaStar, FaHeart, FaPaperPlane } from 'react-icons/fa';
import Modal from './Modal';

const Footer = () => {
    const [showContactModal, setShowContactModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    // Feedback state
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');

    // Contact state
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        alert('Feedback submitted! Thank you.');
        setShowFeedbackModal(false);
        setRating(0);
        setFeedback('');
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        alert('Message sent! We will get back to you soon.');
        setShowContactModal(false);
        setContactForm({ name: '', email: '', message: '' });
    };

    return (
        <footer className="bg-gray-900 text-gray-300 pt-20 pb-10 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 p-32 bg-emerald-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 p-24 bg-teal-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div>
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                                <FaRecycle className="text-xl" />
                            </div>
                            <span className="text-2xl font-bold text-white tracking-tight">E-Suraksha</span>
                        </Link>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Revolutionizing e-waste management through technology and community participation. Join us in making the planet greener, one device at a time.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all duration-300">
                                    <Icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link></li>
                            <li><a href="#about" className="hover:text-emerald-400 transition-colors">About Us</a></li>
                            <li><a href="#features" className="hover:text-emerald-400 transition-colors">Features</a></li>
                            <li><Link to="/login" className="hover:text-emerald-400 transition-colors">Login / Sign Up</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Legal & Support</h3>
                        <ul className="space-y-4">
                            <li><Link to="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                            <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">Help Center</Link></li>
                            <li>
                                <button
                                    onClick={() => setShowContactModal(true)}
                                    className="hover:text-emerald-400 transition-colors text-left"
                                >
                                    Contact Support
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setShowFeedbackModal(true)}
                                    className="hover:text-emerald-400 transition-colors text-left"
                                >
                                    Give Feedback
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Stay Updated</h3>
                        <p className="text-gray-400 mb-4">Subscribe to our newsletter for the latest eco-tips and updates.</p>
                        <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full bg-gray-800 border-none rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-lg transition-colors">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} E-Suraksha. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaMapMarkerAlt className="text-emerald-500" /> New Delhi, India
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 text-sm">
                            <FaPhone className="text-emerald-500" /> +91 1800-123-4567
                        </div>
                    </div>
                </div>
            </div>

            {/* Feedback Modal */}
            <Modal
                isOpen={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
                title="We Value Your Feedback"
            >
                <form onSubmit={handleFeedbackSubmit} className="space-y-6">
                    <div className="flex flex-col items-center gap-4">
                        <p className="text-sm font-semibold text-gray-600 uppercase tracking-wider">How satisfied are you?</p>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                    className="transition-transform hover:scale-125 focus:outline-none"
                                >
                                    <FaStar
                                        className={`text-3xl ${(hover || rating) >= star
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-gray-200'
                                            } transition-colors duration-200`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Comments or suggestions</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Share your thoughts..."
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none resize-none"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Submit Feedback</span>
                        <FaHeart className="text-emerald-300" />
                    </button>
                </form>
            </Modal>

            {/* Contact Modal */}
            <Modal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
                title="Contact Us"
            >
                <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Name</label>
                        <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            placeholder="Your Name"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Message</label>
                        <textarea
                            required
                            value={contactForm.message}
                            onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                            placeholder="How can we help you?"
                            rows="4"
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none resize-none"
                        ></textarea>
                    </div>
                    <button
                        type="submit"
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                    >
                        <span>Send Message</span>
                        <FaPaperPlane className="text-emerald-300" />
                    </button>
                </form>
            </Modal>
        </footer>
    );
};

export default Footer;
