import React from 'react';
import Navbar from '../components/common/Navbar';
import HeroSection from '../components/landing/HeroSection';
import AboutSection from '../components/landing/AboutSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import Footer from '../components/common/Footer';

const LandingPage = () => {
    return (
        <div className="font-sans text-gray-900 bg-white">
            <Navbar />
            <HeroSection />
            <AboutSection />
            <FeaturesSection />
            <HowItWorksSection />
            <Footer />
        </div>
    );
};

export default LandingPage;
