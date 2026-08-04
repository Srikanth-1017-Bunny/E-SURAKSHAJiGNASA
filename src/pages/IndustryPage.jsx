import React, { useState } from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import { FaIndustry, FaTruck, FaUsers, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

const IndustryPage = () => {
    const [formData, setFormData] = useState({
        companyName: '',
        email: '',
        requirements: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.success("Inquiry submitted successfully! Our team will contact you soon.");
        setFormData({ companyName: '', email: '', requirements: '' });
    };

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-32 pb-20 bg-emerald-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-800/20 skew-x-12 transform translate-x-20"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">Partner with <span className="text-emerald-400">Us</span></h1>
                    <p className="text-slate-300 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
                        Join our network of certified recyclers and authorized collectors.
                        Let's build a sustainable future together.
                    </p>
                </div>
            </section>

            {/* Partnership Options */}
            <section className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* For Recyclers */}
                    <div className="group">
                        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <FaIndustry className="text-3xl" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">For Recyclers</h3>
                        <ul className="space-y-4 text-slate-600 font-medium tracking-tight">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                Get a regular and segregated supply of e-waste.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                Helps plan recycling operations smoothly.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0"></span>
                                Supports Municipal Corporation and pollution control compliance.
                            </li>
                        </ul>
                    </div>

                    {/* For Logistics Partners */}
                    <div className="group">
                        <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <FaTruck className="text-3xl" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">For Logistics Partners</h3>
                        <ul className="space-y-4 text-slate-600 font-medium tracking-tight">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                Collect e-waste directly from customers and deliver it to recycling industries.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                Use smart routing to save time and fuel.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></span>
                                Ensures safe and trackable transportation.
                            </li>
                        </ul>
                    </div>

                    {/* For CSR/EPR Partners */}
                    <div className="group">
                        <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <FaUsers className="text-3xl" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-4">For CSR / EPR Partners</h3>
                        <ul className="space-y-4 text-slate-600 font-medium tracking-tight">
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                                Helps companies meet EPR and CSR requirements.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                                Provides clear tracking and reports.
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0"></span>
                                Shows environmental responsibility.
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Inquiry Section */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 flex flex-col md:flex-row gap-12 overflow-hidden relative">
                        <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>

                        <div className="flex-1 space-y-6">
                            <h2 className="text-4xl font-black text-slate-900 leading-tight">Industry <span className="text-emerald-500">Inquiry</span></h2>
                            <p className="text-slate-500 font-medium">Submit your company details to start the partnership onboarding process.</p>

                            <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Industry" className="rounded-3xl shadow-lg mt-8 hidden md:block" />
                        </div>

                        <form onSubmit={handleSubmit} className="flex-1 space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.companyName}
                                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                    placeholder="Tech Recyclers Pvt Ltd"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-bold placeholder-slate-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Official Email</label>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contact@company.com"
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-bold placeholder-slate-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requirements</label>
                                <textarea
                                    rows="4"
                                    required
                                    value={formData.requirements}
                                    onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                    placeholder="Tell us about your capacity and requirements..."
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-bold placeholder-slate-300 resize-none"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3"
                            >
                                Submit Inquiry <FaChevronRight className="text-xs" />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default IndustryPage;
