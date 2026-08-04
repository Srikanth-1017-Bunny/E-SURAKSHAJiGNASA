import React, { useState } from 'react';
import { useCollector } from '../../hooks/useCollector';
import { FaExclamationTriangle, FaPaperPlane } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ComplaintPage = () => {
    const { submitComplaint } = useCollector();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'Medium',
        type: 'User Issue'
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitComplaint(formData);
            toast.success("Complaint submitted successfully");
            navigate('/collector/home');
        } catch (error) {
            toast.error("Failed to submit complaint");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-4 md:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <FaExclamationTriangle className="text-red-500" /> Report an Issue
            </h1>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                    <input
                        required
                        className="w-full bg-gray-50 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="Brief title of the issue"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Issue Type</label>
                        <select
                            className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>User Issue</option>
                            <option>Payment Issue</option>
                            <option>App Bug</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Priority</label>
                        <select
                            className="w-full bg-gray-50 border rounded-xl px-4 py-3 outline-none"
                            value={formData.priority}
                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Urgent</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                    <textarea
                        required
                        className="w-full bg-gray-50 border rounded-xl px-4 py-3 h-32 focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        placeholder="Provide details about the issue..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <button
                    disabled={submitting}
                    className="w-full bg-red-600 text-white py-4 rounded-xl font-bold shadow-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                    <FaPaperPlane /> {submitting ? 'Submitting...' : 'Submit Report'}
                </button>
            </form>
        </div>
    );
};

export default ComplaintPage;
