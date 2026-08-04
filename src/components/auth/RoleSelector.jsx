import React from 'react';

const RoleSelector = ({ selectedRole, onSelect }) => {
    return (
        <div className="flex gap-4 mb-6">
            <button
                type="button"
                onClick={() => onSelect('user')}
                className={`flex-1 p-4 rounded-lg border-2 text-center transition-all ${selectedRole === 'user'
                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold'
                    : 'border-gray-200 hover:border-primary-200'
                    }`}
            >
                <div className="text-lg">User</div>
                <div className="text-xs text-gray-500">Buy & Sell Items</div>
            </button>
            <button
                type="button"
                onClick={() => onSelect('collector')}
                className={`flex-1 p-4 rounded-lg border-2 text-center transition-all ${selectedRole === 'collector'
                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold'
                    : 'border-gray-200 hover:border-primary-200'
                    }`}
            >
                <div className="text-lg">Collector</div>
                <div className="text-xs text-gray-500">Collect E-Waste</div>
            </button>
            <button
                type="button"
                onClick={() => onSelect('government')}
                className={`flex-1 p-4 rounded-lg border-2 text-center transition-all ${selectedRole === 'government'
                    ? 'border-primary-600 bg-primary-50 text-primary-700 font-bold'
                    : 'border-gray-200 hover:border-primary-200'
                    }`}
            >
                <div className="text-lg">Municipal Corporation</div>
                <div className="text-xs text-gray-500">Municipal Authority</div>
            </button>
        </div>
    );
};

export default RoleSelector;
