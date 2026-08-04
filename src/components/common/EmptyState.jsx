import React from 'react';
import { FaInbox } from 'react-icons/fa';

const EmptyState = ({
    title = "No items found",
    message = "There are no items to display at the moment.",
    icon: Icon = FaInbox,
    action
}) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Icon className="text-3xl text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 max-w-sm mb-6">{message}</p>
            {action && (
                <div>{action}</div>
            )}
        </div>
    );
};

export default EmptyState;
