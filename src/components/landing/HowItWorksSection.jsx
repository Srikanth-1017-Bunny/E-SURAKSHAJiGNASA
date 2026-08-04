import React from 'react';
import { FaLaptopMedical, FaUserCheck, FaTruckLoading, FaGift } from 'react-icons/fa';

const HowItWorksSection = () => {
    const steps = [
        {
            id: 1,
            icon: <FaLaptopMedical />,
            title: "List Your E-Waste",
            description: "Upload details and photos of your old gadgets in seconds."
        },
        {
            id: 2,
            icon: <FaUserCheck />,
            title: "Get Verified",
            description: "Our experts verify your listing and assign a certified collector."
        },
        {
            id: 3,
            icon: <FaTruckLoading />,
            title: "Scheduled Pickup",
            description: "Collector arrives at your door at your preferred time slot."
        },
        {
            id: 4,
            icon: <FaGift />,
            title: "Earn Rewards",
            description: "Get paid or earn eco-coins redeemable for exciting vouchers."
        }
    ];

    return (
        <section className="py-24 bg-white" id="how-it-works">
            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h4 className="text-emerald-600 font-bold uppercase tracking-widest text-sm mb-4">Simple Process</h4>
                    <h2 className="text-4xl font-extrabold text-gray-900">How It Works</h2>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
                        {steps.map((step, index) => (
                            <div key={step.id} className="group relative bg-white p-6 rounded-2xl transition-all duration-300 hover:-translate-y-2">
                                <div className="w-20 h-20 mx-auto bg-white border-4 border-emerald-100 rounded-full flex items-center justify-center text-3xl text-emerald-500 mb-6 shadow-xl group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    {step.icon}
                                </div>
                                <div className="absolute top-6 right-1/2 translate-x-1/2 -mt-16 md:mt-0 md:top-0 md:right-0 md:translate-x-1/2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm border-4 border-white shadow-md">
                                    {step.id}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{step.title}</h3>
                                <p className="text-gray-500 text-center leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
