import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const faqs = [
    {
        question: "How does the reward system work?",
        answer: "It's simple! For every item you recycle, you earn 'Eco Coins' based on the weight and type of waste. These coins can be redeemed for gift cards, vouchers, or even donated to environmental causes."
    },
    {
        question: "What items can I recycle?",
        answer: "We accept a wide range of electronic waste including smartphones, laptops, cables, batteries, old chargers, and small home appliances. Hazardous materials are handled separately."
    },
    {
        question: "Is my data safe?",
        answer: "Absolutely. We partner with ISO-certified recyclers who strictly follow data destruction protocols. We also provide a data destruction certificate for devices containing storage media."
    },
    {
        question: "Do you offer doorstep pickup?",
        answer: "Yes! You can schedule a pickup through our dashboard. Our verified collectors will visit your location at your preferred time slot to collect the e-waste."
    },
    {
        question: "Is this service free?",
        answer: "Pickup is free for most household quantities. In fact, we pay YOU for the value of your e-waste via Eco Coins!"
    }
];

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleAccordion = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-gray-50" id="faq">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Frequently Asked Questions</h2>
                    <p className="text-gray-500">Everything you need to know about our service and mission.</p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md"
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full px-8 py-6 text-left flex justify-between items-center focus:outline-none"
                            >
                                <span className="font-bold text-lg text-gray-800">{faq.question}</span>
                                {openIndex === index ? (
                                    <FaChevronUp className="text-emerald-600" />
                                ) : (
                                    <FaChevronDown className="text-gray-400" />
                                )}
                            </button>
                            <div
                                className={`px-8 transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-48 pb-6 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                            >
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
