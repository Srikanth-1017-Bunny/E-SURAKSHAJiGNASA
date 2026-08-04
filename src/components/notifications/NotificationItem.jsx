import React from 'react';
import { Link } from 'react-router-dom';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaGift, FaCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns'; // We might need to handle this if date-fns not installed, using simple updated helper

// Simple relative time helper if date-fns is not available/desired
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

const NotificationItem = ({ notification, onRead, compact = false }) => {
    const { id, type, title, message, createdAt, read, link } = notification;

    const getIcon = () => {
        switch (type) {
            case 'success': return <FaCheckCircle className="text-emerald-500" />;
            case 'warning': return <FaExclamationTriangle className="text-orange-500" />;
            case 'error': return <FaTimesCircle className="text-red-500" />;
            case 'reward': return <FaGift className="text-pink-500" />;
            default: return <FaInfoCircle className="text-blue-500" />;
        }
    };

    const containerClasses = `
        relative flex gap-3 p-4 transition-colors hover:bg-gray-50
        ${!read ? 'bg-blue-50/50' : 'bg-white'}
        ${compact ? 'border-b border-gray-100 last:border-0' : 'rounded-xl border border-gray-100 mb-3 shadow-sm hover:shadow-md'}
    `;

    const handleRead = () => {
        if (!read && onRead) onRead(id);
    };

    const Content = () => (
        <>
            <div className="mt-1 text-lg shrink-0">
                {getIcon()}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-bold ${!read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {title}
                    </h4>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                        {timeAgo(createdAt)}
                    </span>
                </div>
                <p className={`text-sm mt-1 line-clamp-2 ${!read ? 'text-gray-800' : 'text-gray-500'}`}>
                    {message}
                </p>
            </div>
            {!read && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <FaCircle className="text-blue-500 text-[8px]" />
                </div>
            )}
        </>
    );

    if (link) {
        return (
            <Link to={link} className={containerClasses} onClick={handleRead}>
                <Content />
            </Link>
        );
    }

    return (
        <div className={containerClasses} onClick={handleRead} role="button">
            <Content />
        </div>
    );
};

export default NotificationItem;
