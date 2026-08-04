import React, { useState } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import NotificationItem from '../components/notifications/NotificationItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { FaBell, FaCheckDouble, FaFilter } from 'react-icons/fa';

const NotificationsPage = () => {
    const { notifications, loading, markAsRead, markAllAsRead, unreadCount } = useNotifications(50);
    const [filter, setFilter] = useState('all'); // 'all' or 'unread'

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.read);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <FaBell className="text-emerald-500" /> Notifications
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with your latest pickups and rewards.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <button
                        onClick={markAllAsRead}
                        disabled={unreadCount === 0}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaCheckDouble /> Mark All Read
                    </button>

                    <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-xl">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${filter === 'all' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-1.5 text-sm font-bold rounded-lg transition-all ${filter === 'unread' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                        >
                            Unread
                        </button>
                    </div>
                </div>
            </div>

            {/* List */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 min-h-[400px]">
                {filteredNotifications.length > 0 ? (
                    <div className="space-y-4">
                        {filteredNotifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onRead={markAsRead}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-20">
                        <EmptyState
                            title={filter === 'unread' ? "No unread notifications" : "No notifications yet"}
                            message="You're all caught up! Check back later for updates."
                            icon={FaBell}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
