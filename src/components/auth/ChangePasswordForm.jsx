import React, { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

const ChangePasswordForm = () => {
    const { currentUser } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            return toast.error("New passwords do not match");
        }
        setLoading(true);

        try {
            // Re-authenticate first
            const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
            await reauthenticateWithCredential(currentUser, credential);

            // Update password
            await updatePassword(currentUser, newPassword);
            toast.success("Password updated successfully");
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (error) {
            console.error(error);
            toast.error("Failed to update password: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>
            <div>
                <label className="block text-sm font-medium">Current Password</label>
                <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium">New Password</label>
                <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border p-2 rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium">Confirm New Password</label>
                <input type="password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full border p-2 rounded" />
            </div>
            <button type="submit" disabled={loading} className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 disabled:opacity-50">
                {loading ? 'Updating...' : 'Update Password'}
            </button>
        </form>
    );
};

export default ChangePasswordForm;
