import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-4xl font-bold mb-4">404 - Not Found</h1>
            <Link to="/" className="text-primary-600 hover:underline">Go Home</Link>
        </div>
    );
};

export default NotFoundPage;
