import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronRight, FaHome } from 'react-icons/fa';

const Breadcrumbs = ({ items }) => {
    // If items are not provided, we could try to auto-generate from location
    // But for now, let's prefer explicit items: [{ label: 'Home', path: '/' }, { label: 'Category' }]

    return (
        <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                    <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-emerald-600">
                        <FaHome className="mr-2" />
                        Home
                    </Link>
                </li>
                {items && items.map((item, index) => (
                    <li key={index}>
                        <div className="flex items-center">
                            <FaChevronRight className="w-3 h-3 text-gray-400 mx-1" />
                            {item.path ? (
                                <Link to={item.path} className="text-sm font-medium text-gray-500 hover:text-emerald-600 ml-1">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-sm font-medium text-gray-900 ml-1">{item.label}</span>
                            )}
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;
