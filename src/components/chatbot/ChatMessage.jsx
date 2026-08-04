import React from 'react';
import { format } from 'date-fns';
import { FaLeaf } from 'react-icons/fa';

const ChatMessage = ({ message, sender, timestamp }) => {
    const isBot = sender === 'bot';

    return (
        <div className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-6 group items-start gap-4`}>
            {isBot && (
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-900/10">
                    <FaLeaf className="text-sm" />
                </div>
            )}
            <div className={`flex flex-col ${isBot ? 'items-start' : 'items-end'} max-w-[85%]`}>
                <div className={`px-8 py-5 rounded-[2.5rem] shadow-sm text-sm font-bold leading-relaxed relative
                    ${isBot
                        ? 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-xl shadow-slate-200/50'
                        : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none shadow-xl shadow-emerald-900/10'}
                `}>
                    <p className="tracking-tight">{message}</p>
                </div>
                <div className={`text-[10px] mt-2 px-4 opacity-40 font-black uppercase tracking-[0.2em]
                    ${isBot ? 'text-slate-500' : 'text-emerald-700'}
                `}>
                    {timestamp ? format(new Date(timestamp.seconds * 1000), 'p') : format(new Date(), 'p')}
                </div>
            </div>
            {!isBot && (
                <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200">
                    <div className="w-5 h-5 rounded-full bg-slate-300"></div>
                </div>
            )}
        </div>
    );
};

export default ChatMessage;
