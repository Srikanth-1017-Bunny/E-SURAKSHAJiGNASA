import React from 'react';
import { formatTime } from '../../utils/formatting';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';

const ChatListItem = ({ chat, isActive, onClick }) => {
    const { currentUser } = useAuth();
    return (
        <div
            onClick={onClick}
            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${isActive ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''}`}
        >
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center text-gray-400">
                    {chat.otherUser?.photoURL ? (
                        <img src={chat.otherUser.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                        <FaUserCircle className="text-3xl" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                            {chat.otherUser?.displayName || 'Loading...'}
                        </h4>
                        {chat.lastMessage?.createdAt && (
                            <span className="text-xs text-gray-500 whitespace-nowrap">
                                {formatTime(chat.lastMessage.createdAt)}
                            </span>
                        )}
                    </div>
                    {chat.productInfo?.title && (
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-[10px] bg-gray-100 px-1 rounded text-gray-500 uppercase font-bold">Product</span>
                            <p className="text-xs text-primary-600 font-medium truncate">{chat.productInfo.title}</p>
                        </div>
                    )}
                    <p className={`text-sm truncate ${isActive ? 'text-primary-700 font-medium' : 'text-gray-500'}`}>
                        {chat.lastMessage?.senderId === currentUser.uid ? 'You: ' : ''}
                        {chat.lastMessage?.text || 'Started a conversation'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatListItem;
