import React, { useState } from 'react';
import { useController } from '../../hooks/useController';
import { FaSearch, FaUserShield, FaUserTie, FaUser } from 'react-icons/fa';
import { formatDate } from '../../utils/formatting';

const UsersManagementPage = () => {
    const { users, loading, updateUserRole } = useController();
    const [searchTerm, setSearchTerm] = useState('');

    if (loading) return <div className="p-8 text-center">Loading Users...</div>;

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case 'controller': return <FaUserShield className="text-purple-500" />;
            case 'collector': return <FaUserTie className="text-orange-500" />;
            default: return <FaUser className="text-gray-400" />;
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                    <p className="text-gray-500">View and manage all registered users.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Joined Date</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg">
                                            {user.displayName?.[0] || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{user.displayName || 'Anonymous'}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full w-fit border border-gray-100">
                                        {getRoleIcon(user.role)}
                                        <span className="text-sm font-medium capitalize text-gray-700">{user.role || 'user'}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {formatDate(user.createdAt)}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <select
                                        className="bg-white border rounded-lg px-3 py-1 text-sm outline-none focus:border-emerald-500 cursor-pointer hover:bg-gray-50"
                                        value={user.role || 'user'}
                                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                                    >
                                        <option value="user">User</option>
                                        <option value="collector">Collector</option>
                                        <option value="controller">Controller</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                    No users found matching "{searchTerm}"
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersManagementPage;
