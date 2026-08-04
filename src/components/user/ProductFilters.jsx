import React from 'react';

const ProductFilters = ({ filters, onFilterChange }) => {
    const categories = ['All', 'Electronics', 'Appliances', 'Accessories', 'Parts', 'Other'];

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm h-fit">
            <h3 className="font-semibold mb-3">Filters</h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="space-y-2">
                    {categories.map(cat => (
                        <label key={cat} className="flex items-center text-sm text-gray-600 cursor-pointer hover:text-primary-600">
                            <input
                                type="radio"
                                name="category"
                                value={cat}
                                checked={filters.category === cat}
                                onChange={(e) => onFilterChange('category', e.target.value)}
                                className="mr-2 text-primary-600 focus:ring-primary-500"
                            />
                            {cat}
                        </label>
                    ))}
                </div>
            </div>

            {/* Add more filters like Price Range, Condition here */}
        </div>
    );
};

export default ProductFilters;
