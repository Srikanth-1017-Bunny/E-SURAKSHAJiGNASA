import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell, FaCheckDouble } from 'react-icons/fa';
import NotificationItem from './NotificationItem';
import EmptyState from '../common/EmptyState';

const NotificationDropdown = ({ notifications, unreadCount, onMarkAllRead, onRead, onClose }) => {
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                // Determine if we clicked the bell icon (which is outside this component usually)
                // Handled by parent usually, but good safeguard
                // onClose(); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={dropdownRef}
            className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fadeInOriginTopRight origin-top-right transition-all"
        >
            <div className="px-4 py-3 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FaBell className="text-emerald-500" /> Notifications
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {unreadCount}
                        </span>
                    )}
                </h3>
                {unreadCount > 0 && (
                    <button
                        onClick={onMarkAllRead}
                        className="text-xs text-blue-600 font-bold hover:text-blue-800 flex items-center gap-1 transition-colors"
                    >
                        <FaCheckDouble /> Mark all read
                    </button>
                )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onRead={onRead}
                            compact={true}
                        />
                    ))
                ) : (
                    <div className="py-8">
                        <EmptyState
                            title="No notifications"
                            message="You're all caught up!"
                            icon={FaBell}
                        />
                    </div>
                )}
            </div>

            <div className="p-2 border-t border-gray-50 bg-gray-50">
                <Link
                    to="/notifications"
                    className="block w-full py-2 text-center text-sm font-bold text-gray-600 hover:text-emerald-600 hover:bg-white rounded-lg transition-all"
                    onClick={onClose}
                >
                    View All Notifications
                </Link>
            </div>
        </div>
    );
};

export default NotificationDropdown;
