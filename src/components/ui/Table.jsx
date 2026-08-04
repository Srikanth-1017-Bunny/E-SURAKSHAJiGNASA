import React from 'react';

const Table = ({ children, className = '' }) => {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="w-full text-left border-collapse">
                {children}
            </table>
        </div>
    );
};

export const TableHeader = ({ children, className = '' }) => (
    <thead className={`bg-secondary-50 border-b border-secondary-200 ${className}`}>
        {children}
    </thead>
);

export const TableHead = ({ children, className = '' }) => (
    <th className={`px-6 py-3 text-xs font-medium text-secondary-500 uppercase tracking-wider ${className}`}>
        {children}
    </th>
);

export const TableBody = ({ children, className = '' }) => (
    <tbody className={`bg-white divide-y divide-secondary-200 ${className}`}>
        {children}
    </tbody>
);

export const TableRow = ({ children, className = '', hoverable = true }) => (
    <tr className={`${hoverable ? 'hover:bg-secondary-50 transition-colors' : ''} ${className}`}>
        {children}
    </tr>
);

export const TableCell = ({ children, className = '' }) => (
    <td className={`px-6 py-4 whitespace-nowrap text-sm text-secondary-700 ${className}`}>
        {children}
    </td>
);

export default Table;
