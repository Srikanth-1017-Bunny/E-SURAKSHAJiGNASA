import React, { useState } from 'react';
import { FaPaperPlane, FaPaperclip } from 'react-icons/fa';

const ChatInput = ({ onSend, disabled }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if ((!text.trim()) || disabled) return;

        onSend(text.trim());
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="border-t bg-white p-4 flex gap-2 items-center">
            <button
                type="button"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                disabled={disabled}
                title="Attach file (Coming soon)"
            >
                <FaPaperclip />
            </button>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                disabled={disabled}
            />
            <button
                type="submit"
                disabled={!text.trim() || disabled}
                className="p-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md"
            >
                <FaPaperPlane />
            </button>
        </form>
    );
};

export default ChatInput;
