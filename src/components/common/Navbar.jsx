import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaRecycle, FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaBell } from 'react-icons/fa';
import NotificationDropdown from '../notifications/NotificationDropdown';
import { useNotifications } from '../../hooks/useNotifications';

const Navbar = () => {
    const { currentUser, userRole, logout } = useAuth();
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Close menus on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setProfileOpen(false);
        setNotificationsOpen(false);
    }, [location]);

    // ... scroll effect ...

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const getNavLinks = () => {
        if (!currentUser) {
            return [
                { name: 'Home', href: '/' }, // Use absolute paths for routing
                { name: 'About', href: '#about' },
                { name: 'Solutions', href: '#features' },
                { name: 'How It Works', href: '#how-it-works' },
                { name: 'Industry', href: '/industry' },
                { name: 'Recycle Guide', href: '/recycling-guide' },
            ];
        }

        switch (userRole) {
            case 'government':
                return [
                    { name: 'Dashboard', href: '/government/dashboard' },
                ];
            case 'collector':
                return [
                    { name: 'Dashboard', href: '/collector/home' },
                    { name: 'Pickups', href: '/collector/products' },
                    { name: 'History', href: '/collector/history' },
                ];
            default: // 'user'
                return [
                    { name: 'Dashboard', href: '/user/home' },
                    { name: 'Dispose Device', href: '/user/dispose' },
                    { name: 'My Activity', href: '/user/requests' },
                    { name: 'Rewards', href: '/user/rewards' },
                ];
        }
    };

    // ... getNavLinks ...
    const navLinks = getNavLinks();

    return (
        <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled || location.pathname !== '/' ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'}`}>
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Brand */}
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-emerald-500/30 transition-all duration-300">
                        <FaRecycle className="text-xl animate-spin-slow" />
                    </div>
                    <div className="flex flex-col">
                        <span className={`font-bold text-xl leading-none ${scrolled || location.pathname !== '/' ? 'text-gray-800' : 'text-emerald-900'}`}>E-Suraksha</span>
                        <span className={`text-xs font-medium tracking-wider ${scrolled || location.pathname !== '/' ? 'text-gray-500' : 'text-emerald-700'}`}>Green tech Solutions</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => {
                        const isExternal = link.href.includes('#');
                        return isExternal ? (
                            <a
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-600' : 'text-gray-700'}`}
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.href}
                                className={`text-sm font-semibold hover:text-emerald-500 transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-600' : 'text-gray-700'}`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {currentUser ? (
                        <div className="flex items-center gap-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                                    className={`p-2 rounded-full transition-colors relative ${scrolled || location.pathname !== '/' ? 'text-gray-600 hover:bg-gray-100' : 'text-emerald-700 hover:bg-white/20'}`}
                                >
                                    <FaBell className="text-lg" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                                    )}
                                </button>

                                {notificationsOpen && (
                                    <NotificationDropdown
                                        notifications={notifications}
                                        unreadCount={unreadCount}
                                        onMarkAllRead={markAllAsRead}
                                        onRead={markAsRead}
                                        onClose={() => setNotificationsOpen(false)}
                                    />
                                )}
                            </div>

                            {/* Profile Dropdown Trigger */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 focus:outline-none bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 transition-colors"
                                >
                                    {currentUser.photoURL ? (
                                        <img src={currentUser.photoURL} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700">
                                            {currentUser.displayName?.[0] || 'U'}
                                        </div>
                                    )}
                                    <span className="text-sm font-bold text-gray-700 truncate max-w-[100px]">{currentUser.displayName || 'User'}</span>
                                </button>

                                {/* Dropdown Menu */}
                                {profileOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-fadeInOriginTopRight">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{userRole || 'User'}</p>
                                            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.email}</p>
                                        </div>
                                        <Link to="/change-password" className="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-emerald-600">Change Password</Link>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 font-medium flex items-center gap-2"
                                        >
                                            <FaSignOutAlt /> Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className={`font-semibold px-4 py-2 rounded-lg transition-colors ${scrolled || location.pathname !== '/' ? 'text-gray-600 hover:text-emerald-600' : 'text-gray-700 hover:text-emerald-700'}`}
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-semibold shadow-lg shadow-emerald-600/20 transition-all transform hover:-translate-y-0.5"
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={`md:hidden text-2xl ${scrolled || location.pathname !== '/' ? 'text-gray-700' : 'text-emerald-900'}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-100 p-6 flex flex-col gap-4 animate-fadeIn max-h-[90vh] overflow-y-auto">
                    {currentUser && (
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
                                {currentUser.displayName?.[0] || 'U'}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">{currentUser.displayName || 'User'}</p>
                                <p className="text-xs text-gray-500">{currentUser.email}</p>
                            </div>
                        </div>
                    )}

                    {navLinks.map((link) => {
                        const isExternal = link.href.includes('#');
                        return isExternal ? (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 font-semibold py-2 border-b border-gray-50 hover:text-emerald-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </a>
                        ) : (
                            <Link
                                key={link.name}
                                to={link.href}
                                className="text-gray-700 font-semibold py-2 border-b border-gray-50 hover:text-emerald-600"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        );
                    })}

                    {!currentUser ? (
                        <div className="flex flex-col gap-3 mt-4">
                            <Link to="/login" className="text-center text-gray-700 font-semibold py-3 border border-gray-200 rounded-lg">
                                Login
                            </Link>
                            <Link to="/signup" className="text-center bg-emerald-600 text-white font-semibold py-3 rounded-lg shadow-lg">
                                Get Started
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 mt-2">
                            <Link to="/change-password" className="text-gray-600 py-2">Change Password</Link>
                            <button onClick={handleLogout} className="text-red-500 font-bold py-2 text-left flex items-center gap-2">
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
