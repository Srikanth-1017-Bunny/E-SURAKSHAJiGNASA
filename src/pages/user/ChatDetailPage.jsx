import React, { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useChatMessages } from '../../hooks/useChatMessages';
import { useAuth } from '../../contexts/AuthContext';
import MessageBubble from '../../components/chat/MessageBubble';
import ChatInput from '../../components/chat/ChatInput';
import { FaArrowLeft, FaTruck } from 'react-icons/fa';

const ChatDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();
    const { messages, loading, sendMessage } = useChatMessages(id);
    const bottomRef = useRef(null);

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (text, type = 'text') => {
        try {
            await sendMessage(text, type);
        } catch (error) {
            console.error("Failed to send", error);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-100">
            {/* Header */}
            <header className="bg-white p-4 flex flex-col border-b shadow-sm shrink-0">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => navigate('/user/chats')} className="text-gray-600 hover:text-gray-900">
                        <FaArrowLeft />
                    </button>
                    <div className="flex-1">
                        <h2 className="font-bold text-gray-800">Chat</h2>
                    </div>
                    <button
                        onClick={() => handleSend("I would like to request a pickup for this item.", "transport_request")}
                        className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-orange-200"
                        title="Request Transport"
                    >
                        <FaTruck />
                        <span className="hidden sm:inline">Request Pickup</span>
                    </button>
                </div>

                {/* Product Info Banner */}
                {messages[0]?.chatInfo?.productTitle && (
                    <div className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg border border-dashed text-sm">
                        {messages[0].chatInfo.productImage && (
                            <img src={messages[0].chatInfo.productImage} alt="" className="w-10 h-10 rounded object-cover" />
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-gray-900 truncate">{messages[0].chatInfo.productTitle}</p>
                            <p className="text-xs text-gray-500">Discussing this item</p>
                        </div>
                    </div>
                )}
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="text-center text-gray-400 mt-10">Loading messages...</div>
                ) : (
                    <>
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 mt-10">
                                <p>No messages yet.</p>
                                <p className="text-sm">Say hello!</p>
                            </div>
                        )}
                        {messages.map(msg => (
                            <MessageBubble
                                key={msg.id}
                                message={msg}
                                isOwn={msg.senderId === currentUser.uid}
                            />
                        ))}
                        <div ref={bottomRef} />
                    </>
                )}
            </div>

            {/* Input Area */}
            <div className="shrink-0">
                <ChatInput onSend={handleSend} disabled={loading} />
            </div>
        </div>
    );
};

export default ChatDetailPage;
