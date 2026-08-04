import React from 'react';
import { FaRecycle } from 'react-icons/fa';

const LoadingSpinner = ({ fullScreen = false, text = "Loading..." }) => {
    const content = (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-emerald-100 rounded-full"></div>
                <div className="absolute top-0 w-16 h-16 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <FaRecycle className="text-emerald-500 text-xl animate-pulse" />
                </div>
            </div>
            {text && <p className="text-emerald-800 font-medium animate-pulse">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {content}
            </div>
        );
    }

    return <div className="p-8 flex items-center justify-center">{content}</div>;
};

export default LoadingSpinner;
