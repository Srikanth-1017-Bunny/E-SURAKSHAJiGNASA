import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf, LayoutDashboard, Wallet, Map, Settings, LogOut } from 'lucide-react';

const Sidebar = ({ role = 'user', isMobileOpen, setIsMobileOpen }) => {
    // Example navigation links, these will be dynamically adjusted based on the role later
    const navLinks = [
        { name: 'Dashboard', path: `/${role}/home`, icon: LayoutDashboard },
        { name: 'Map Area', path: `/${role}/map`, icon: Map },
        { name: 'Settings', path: '/settings', icon: Settings },
    ];

    const handleLinkClick = () => {
        if (setIsMobileOpen) setIsMobileOpen(false);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-secondary-900/50 z-40 lg:hidden" 
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar container */}
            <aside className={`
                fixed top-0 left-0 z-50 h-screen w-64 bg-surface border-r border-secondary-200 
                transform transition-transform duration-300 ease-in-out
                lg:translate-x-0 lg:static lg:h-screen lg:z-auto
                flex flex-col
                ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Brand / Logo Area */}
                <div className="flex items-center justify-center h-16 border-b border-secondary-200 px-4">
                    <Leaf className="w-8 h-8 text-primary-600 mr-2" />
                    <span className="text-xl font-bold text-secondary-900 tracking-tight">E-Suraksha</span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <NavLink
                                key={link.name}
                                to={link.path}
                                onClick={handleLinkClick}
                                className={({ isActive }) => `
                                    flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                    ${isActive 
                                        ? 'bg-primary-50 text-primary-700' 
                                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                                    }
                                `}
                            >
                                <Icon className="w-5 h-5 mr-3" />
                                {link.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-secondary-200">
                    <button className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
