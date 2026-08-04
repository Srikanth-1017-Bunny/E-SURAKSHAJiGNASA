import React from 'react';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';

const ChangePasswordPage = () => {
    return (
        <div className="py-8 px-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Account Security</h1>
            <ChangePasswordForm />
        </div>
    );
};

export default ChangePasswordPage;
