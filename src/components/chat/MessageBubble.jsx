import React from 'react';
import { formatTime } from '../../utils/formatting';

const MessageBubble = ({ message, isOwn }) => {
    return (
        <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[75%] px-4 py-2 rounded-lg ${isOwn
                        ? 'bg-primary-600 text-white rounded-br-none'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                    }`}
            >
                {message.type === 'image' && message.attachment ? (
                    <div className="mb-2">
                        <img src={message.attachment} alt="Attachment" className="max-w-full rounded-md" />
                    </div>
                ) : null}

                <p className="whitespace-pre-wrap">{message.text}</p>

                <div className={`text-[10px] mt-1 text-right ${isOwn ? 'text-primary-100' : 'text-gray-400'}`}>
                    {message.createdAt ? formatTime(message.createdAt) : '...'}
                </div>
            </div>
        </div>
    );
};

export default MessageBubble;
