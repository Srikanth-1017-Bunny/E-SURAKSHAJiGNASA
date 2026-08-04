import React from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';

const Header = ({ setIsMobileOpen }) => {
    return (
        <header className="bg-surface border-b border-secondary-200 h-16 flex items-center justify-between px-4 lg:px-8 z-10">
            {/* Mobile Menu Button */}
            <div className="flex items-center lg:hidden">
                <button 
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 -ml-2 text-secondary-500 hover:text-secondary-900 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Search Bar (Hidden on very small screens) */}
            <div className="hidden sm:flex flex-1 max-w-md ml-4 lg:ml-0">
                <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-secondary-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-lg leading-5 bg-secondary-50 placeholder-secondary-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-colors"
                        placeholder="Search for e-waste, collectors..."
                    />
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4 ml-auto">
                {/* Language Toggle */}
                <div className="hidden md:flex items-center bg-secondary-50 rounded-lg p-1 border border-secondary-200">
                    <button className="px-2 py-1 text-xs font-bold bg-white shadow-sm rounded text-primary-600">EN</button>
                    <button className="px-2 py-1 text-xs font-bold text-secondary-500 hover:text-secondary-700">HI</button>
                    <button className="px-2 py-1 text-xs font-bold text-secondary-500 hover:text-secondary-700">TE</button>
                </div>

                <button className="p-2 text-secondary-400 hover:text-secondary-600 rounded-full hover:bg-secondary-100 transition-colors relative">
                    <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-white"></span>
                    <Bell className="w-6 h-6" />
                </button>
                
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center border border-primary-200 cursor-pointer">
                    <User className="w-5 h-5 text-primary-600" />
                </div>
            </div>
        </header>
    );
};

export default Header;
