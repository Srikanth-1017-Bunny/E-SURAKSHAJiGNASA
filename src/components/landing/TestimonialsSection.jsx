import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const reviews = [
    {
        id: 1,
        name: "Priya Sharma",
        role: "Eco-Conscious User",
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        content: "I've always struggled with disposing of old wires and phones. E-Suraksha made it incredibly easy. The pickup was on time, and the 'Eco Coins' were a great bonus!",
        rating: 5
    },
    {
        id: 2,
        name: "Rahul Verma",
        role: "Tech Enthusiast",
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        content: "Data security was my biggest concern. Seeing the certified process and getting a destruction certificate gave me complete peace of mind. Highly recommended.",
        rating: 5
    },
    {
        id: 3,
        name: "Anjali Gupta",
        role: "Homemaker",
        image: "https://randomuser.me/api/portraits/women/68.jpg",
        content: "Such a user-friendly app! I cleared out years of electronic junk from my house in one go. The rewards system is actually quite generous.",
        rating: 4
    }
];

const TestimonialsSection = () => {
    return (
        <section className="py-24 bg-white" id="reviews">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-emerald-600 font-bold tracking-wider uppercase text-sm">Community Stories</span>
                    <h2 className="text-4xl font-extrabold text-gray-900 mt-2">What Our Users Say</h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 rounded-2xl p-8 relative hover:-translate-y-2 transition-transform duration-300">
                            <FaQuoteLeft className="text-4xl text-emerald-100 absolute top-6 left-6" />

                            <div className="relative z-10">
                                <div className="flex text-yellow-400 mb-4 text-sm gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                    ))}
                                </div>
                                <p className="text-gray-600 italic mb-6 leading-relaxed">"{review.content}"</p>

                                <div className="flex items-center gap-4">
                                    <img
                                        src={review.image}
                                        alt={review.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{review.name}</h4>
                                        <p className="text-xs text-gray-500">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
