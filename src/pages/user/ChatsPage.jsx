import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChats } from '../../hooks/useChats';
import ChatListItem from '../../components/chat/ChatListItem';

const ChatsPage = () => {
    const { chats, loading } = useChats();
    const navigate = useNavigate();

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading conversations...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white min-h-screen shadow-sm">
            <header className="p-4 border-b bg-white sticky top-0 z-10">
                <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            </header>

            <div className="divide-y">
                {chats.length > 0 ? (
                    chats.map(chat => (
                        <ChatListItem
                            key={chat.id}
                            chat={chat}
                            onClick={() => navigate(`/user/chats/${chat.id}`)}
                        />
                    ))
                ) : (
                    <div className="p-8 text-center text-gray-500">
                        <p>No conversations yet.</p>
                        <p className="text-sm mt-2">Start a chat from a product page!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatsPage;
