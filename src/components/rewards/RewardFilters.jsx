import React from 'react';

const RewardFilters = ({ activeCategory, onFilterChange }) => {
    const categories = ['All', 'Vouchers', 'Electronics', 'Merch', 'Donations'];

    return (
        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
            {categories.map((cat) => (
                <button
                    key={cat}
                    onClick={() => onFilterChange(cat === 'All' ? null : cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${(activeCategory === cat || (!activeCategory && cat === 'All'))
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-50 border'
                        }`}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
};

export default RewardFilters;
