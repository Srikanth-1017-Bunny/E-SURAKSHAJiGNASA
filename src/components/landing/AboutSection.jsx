import React from 'react';
import { FaGlobeAsia, FaHandHoldingHeart } from 'react-icons/fa';

const AboutSection = () => {
    return (
        <section className="py-20 bg-white" id="about">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl transform rotate-3 opacity-20"></div>
                        <img
                            src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt="Sustainable Future"
                            className="relative rounded-3xl shadow-2xl object-cover h-[400px] w-full transform transition hover:-translate-y-2 duration-500"
                        />
                    </div>

                    <div>
                        <h4 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">About E-Suraksha</h4>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight">
                            Building a Sustainable World <br /> One Device at a Time
                        </h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                            At E-Suraksha, we are driven by a singular mission: to eliminate e-waste hazards through responsible recycling and technological innovation. We bridge the gap between conscientious consumers and certified recyclers, creating a circular economy where electronic waste is a resource, not a burden.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
