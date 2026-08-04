import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaPaperPlane, FaEnvelope, FaHeart } from 'react-icons/fa';

const ContactFeedback = () => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });

    const handleFeedbackSubmit = (e) => {
        e.preventDefault();
        // Handle feedback submission logic
        alert('Feedback submitted! Thank you.');
        setRating(0);
        setFeedback('');
    };

    const handleContactSubmit = (e) => {
        e.preventDefault();
        // Handle contact submission logic
        alert('Message sent! We will get back to you soon.');
        setContactForm({ name: '', email: '', message: '' });
    };

    return (
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Feedback Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex-1"
                    >
                        <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-emerald-100/50 border border-emerald-50/50 relative">
                            <div className="absolute -top-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl"></div>

                            <div className="text-center mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">We Value Your Feedback</h2>
                                <p className="text-gray-500">Tell us about your experience with E-Suraksha.</p>
                            </div>

                            <form onSubmit={handleFeedbackSubmit} className="space-y-8">
                                <div className="flex flex-col items-center gap-4">
                                    <p className="text-sm font-semibold text-gray-700 uppercase tracking-wider">How satisfied are you?</p>
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
                                                    className={`text-4xl ${(hover || rating) >= star
                                                        ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                                                        : 'text-gray-200'
                                                        } transition-colors duration-200`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Any comments or suggestions?</label>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Share your thoughts..."
                                        rows="4"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span>Submit Feedback</span>
                                    <FaHeart className="text-emerald-300 group-hover:scale-125 transition-transform" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex-1"
                    >
                        <div className="h-full bg-white p-10 rounded-3xl shadow-2xl shadow-teal-100/50 border border-teal-50/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-24 bg-teal-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                            <div className="mb-10">
                                <h2 className="text-3xl font-bold text-gray-900 mb-3">Contact Us</h2>
                                <p className="text-gray-500">Have questions? We're here to help you.</p>
                            </div>

                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={contactForm.name}
                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                        placeholder="Your Name"
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
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
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none"
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
                                        className="w-full px-5 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-teal-200 transition-all flex items-center justify-center gap-2 group"
                                >
                                    <span>Send Message</span>
                                    <FaPaperPlane className="text-teal-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                </motion.button>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ContactFeedback;
