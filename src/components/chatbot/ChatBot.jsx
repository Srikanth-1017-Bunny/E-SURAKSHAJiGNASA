import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTimes, FaPaperPlane, FaLeaf } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { getChatResponse, saveChatMessage, getChatHistory } from '../../services/chatbotService';
import ChatMessage from './ChatMessage';

const ChatBot = () => {
    const { currentUser } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    useEffect(() => {
        const loadHistory = async () => {
            if (isOpen) {
                if (currentUser) {
                    const history = await getChatHistory(currentUser.uid);
                    if (history.length > 0) {
                        setMessages(history);
                    } else {
                        setMessages([{
                            message: "Hi! I'm Suraksha AI. How can I help you with e-waste recycling today?",
                            sender: 'bot',
                            timestamp: { seconds: Date.now() / 1000 }
                        }]);
                    }
                } else {
                    // Default message for guests
                    setMessages([{
                        message: "Hi! I'm Suraksha AI. How can I help you with e-waste recycling today?",
                        sender: 'bot',
                        timestamp: { seconds: Date.now() / 1000 }
                    }]);
                }
            }
        };
        loadHistory();
    }, [currentUser, isOpen]);

    const handleSend = async (e, quickReplyMsg = null) => {
        if (e && e.preventDefault) e.preventDefault();

        const userMsg = quickReplyMsg || input.trim();
        if (!userMsg) return;

        if (!quickReplyMsg) setInput('');

        const userMessageObj = {
            message: userMsg,
            sender: 'user',
            timestamp: { seconds: Date.now() / 1000 }
        };

        setMessages(prev => [...prev, userMessageObj]);

        if (currentUser) {
            await saveChatMessage(currentUser.uid, userMsg, 'user');
        }

        setIsTyping(true);

        const aiResponse = await getChatResponse(userMsg);
        setIsTyping(false);

        const botMessageObj = {
            message: aiResponse.text,
            sender: 'bot',
            timestamp: { seconds: Date.now() / 1000 }
        };

        setMessages(prev => [...prev, botMessageObj]);

        if (currentUser) {
            await saveChatMessage(currentUser.uid, aiResponse.text, 'bot');
        }
    };

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm pointer-events-auto cursor-pointer"
                    />
                )}
            </AnimatePresence>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col pointer-events-auto border-l border-slate-100 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 p-8 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl animate-pulse"></div>
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner">
                                    <FaLeaf className="text-2xl text-emerald-100" />
                                </div>
                                <div>
                                    <h3 className="font-black text-lg uppercase tracking-[0.2em] leading-none mb-1">E-Suraksha AI</h3>
                                    <span className="text-[10px] text-emerald-50 font-black uppercase tracking-widest flex items-center gap-2 bg-black/10 px-2 py-0.5 rounded-full w-fit">
                                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                                        Eco-Assistant • Online
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-10 h-10 rounded-xl hover:bg-white/20 flex items-center justify-center transition-all hover:rotate-90 group relative z-10"
                            >
                                <FaTimes className="text-xl group-hover:scale-110" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-slate-50/30 custom-scrollbar scroll-smooth">
                            {messages.map((msg, index) => (
                                <ChatMessage
                                    key={index}
                                    message={msg.message}
                                    sender={msg.sender}
                                    timestamp={msg.timestamp}
                                />
                            ))}
                            {isTyping && (
                                <div className="flex justify-start mb-6">
                                    <div className="bg-white border border-slate-100 px-6 py-4 rounded-[2rem] rounded-bl-none shadow-sm flex gap-1.5">
                                        <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-150"></div>
                                        <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce delay-300"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Replies */}
                        <div className="px-8 py-4 flex flex-wrap gap-2 bg-white/50 backdrop-blur-sm border-t border-slate-100">
                            {[
                                "What can I recycle?",
                                "How to recycle?",
                                "Tell me about collectors",
                                "How do rewards work?"
                            ].map((text, i) => (
                                <button
                                    key={i}
                                    onClick={() => handleSend({ preventDefault: () => { }, target: { value: text } }, text)}
                                    className="px-4 py-2 bg-white border border-emerald-100 text-emerald-700 text-xs font-bold rounded-full hover:bg-emerald-50 hover:border-emerald-300 transition-all shadow-sm"
                                >
                                    {text}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSend} className="p-8 bg-white border-t border-slate-100 safe-bottom">
                            <div className="relative group">
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 rounded-[2rem] opacity-20 group-focus-within:opacity-40 blur transition duration-300"></div>
                                <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-[2rem] focus-within:border-emerald-500 focus-within:bg-white focus-within:shadow-xl focus-within:shadow-emerald-900/5 transition-all">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="How can I help you today?"
                                        className="w-full pl-8 pr-16 py-5 bg-transparent outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300 placeholder:italic"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!input.trim() || isTyping}
                                        className="absolute right-2 px-6 h-12 bg-emerald-600 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/20 disabled:opacity-30 disabled:grayscale group/btn"
                                    >
                                        <FaPaperPlane className="text-sm group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-10 right-10 w-20 h-20 bg-gradient-to-tr from-emerald-600 to-teal-500 text-white rounded-full shadow-[0_20px_50px_rgba(5,150,105,0.3)] flex items-center justify-center text-3xl hover:shadow-[0_25px_60px_rgba(5,150,105,0.4)] transition-all pointer-events-auto border-4 border-white group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <FaComments className="relative z-10" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-300 rounded-full border-2 border-white animate-pulse"></span>

                    {/* Tooltip */}
                    <div className="absolute right-full mr-6 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] px-5 py-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0 whitespace-nowrap hidden md:block border border-white/10 shadow-2xl">
                        Consult Suraksha AI
                    </div>
                </motion.button>
            )}
        </div>
    );
};

export default ChatBot;
