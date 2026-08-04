import React from 'react';
import { FaRecycle, FaCloudMeatball, FaSmile } from 'react-icons/fa';

const ImpactSection = () => {
    return (
        <section className="py-24 bg-gray-900 text-white relative overflow-hidden" id="impact">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 right-0 w-64 h-64 bg-teal-600 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h2 className="text-4xl font-extrabold mb-6">Our Impact So Far</h2>
                    <p className="text-xl text-gray-400">
                        Together, we are making a tangible difference. Every device recycled contributes to a healthier planet.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="inline-block p-4 rounded-full bg-emerald-500/20 text-emerald-400 text-4xl mb-6">
                            <FaRecycle />
                        </div>
                        <h3 className="text-5xl font-bold mb-2 text-white">50K+</h3>
                        <p className="text-emerald-200 uppercase tracking-widest text-sm font-semibold">Devices Recycled</p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="inline-block p-4 rounded-full bg-blue-500/20 text-blue-400 text-4xl mb-6">
                            <FaCloudMeatball />
                        </div>
                        <h3 className="text-5xl font-bold mb-2 text-white">120T</h3>
                        <p className="text-blue-200 uppercase tracking-widest text-sm font-semibold">CO₂ Emissions Reduced</p>
                    </div>

                    <div className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors">
                        <div className="inline-block p-4 rounded-full bg-orange-500/20 text-orange-400 text-4xl mb-6">
                            <FaSmile />
                        </div>
                        <h3 className="text-5xl font-bold mb-2 text-white">15K+</h3>
                        <p className="text-orange-200 uppercase tracking-widest text-sm font-semibold">Happy Users</p>
                    </div>
                </div>

                {/* CTA Box */}
                <div className="mt-24 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-12 text-center shadow-2xl transform hover:scale-[1.01] transition-transform duration-300">
                    <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to make a difference?</h2>
                    <p className="text-xl text-emerald-50 mb-10 max-w-2xl mx-auto">
                        Join thousands of responsible citizens who are cleaning up the planet, one device at a time.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href="/signup" className="px-10 py-4 bg-white text-emerald-700 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-black/20 transition-all">
                            Start Recycling Now
                        </a>
                        <a href="/login" className="px-10 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                            Log In
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ImpactSection;
