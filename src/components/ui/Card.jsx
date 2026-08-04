import React from 'react';

const Card = ({ children, className = '', hoverable = false, padding = 'p-6', ...props }) => {
    return (
        <div 
            className={`
                bg-surface rounded-xl border border-secondary-200 shadow-card 
                ${hoverable ? 'transition-shadow duration-300 hover:shadow-card-hover' : ''}
                ${padding}
                ${className}
            `}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>
        {children}
    </div>
);

export const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-lg font-semibold text-secondary-900 ${className}`}>
        {children}
    </h3>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`mt-4 pt-4 border-t border-secondary-100 ${className}`}>
        {children}
    </div>
);

export default Card;
