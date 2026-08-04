import React from 'react';
import { motion } from 'framer-motion';
import { Recycle } from 'lucide-react';

const SplashScreen = ({ userName = 'User', showIntro = true }) => {
    if (!showIntro) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center overflow-hidden">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 10, duration: 1 }}
                className="mb-8 p-6 bg-teal-50 rounded-[2rem] border border-teal-100"
            >
                <Recycle size={50} className="text-teal-500" />
            </motion.div>

            <div className="text-center space-y-4 px-6 font-sans">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col items-center gap-1"
                >
                    <span className="text-slate-400 font-bold uppercase tracking-[0.4em] text-[10px]">Eco Portal v2</span>
                    <h2 className="text-slate-800 text-2xl font-[1000] tracking-tight">
                        Hi, <span className="text-teal-600">{userName}</span>
                    </h2>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="text-3xl md:text-5xl font-[1000] tracking-tighter text-slate-900"
                >
                    Welcome to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">E-SURAKSHA</span>
                </motion.h1>
            </div>
        </div>
    );
};

export default SplashScreen;
