import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    FaArrowLeft, FaMobileAlt, FaLaptop, FaTabletAlt, FaDesktop,
    FaKeyboard, FaPrint, FaCamera, FaHeadphones, FaClock,
    FaGamepad, FaBatteryFull, FaMicrochip
} from 'react-icons/fa';

const CategorySelectionPage = () => {
    const navigate = useNavigate();
    const { optionId } = useParams();

    const electronicItems = [
        { id: 'smartphone', name: 'SMARTPHONE', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop', description: 'Mobile phones, iPhones, Android devices' },
        { id: 'laptop', name: 'LAPTOP', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2000&auto=format&fit=crop', description: 'Laptops, notebooks, MacBooks' },
        { id: 'tablet', name: 'TABLET', image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=2000&auto=format&fit=crop', description: 'Tablets, iPads' },
        { id: 'monitor', name: 'MONITOR', image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=2000&auto=format&fit=crop', description: 'Computer monitors, displays, screens' },
        { id: 'keyboard-mouse', name: 'KEYBOARD & MOUSE', image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?q=80&w=2000&auto=format&fit=crop', description: 'Keyboards, mice, input devices' },
        { id: 'printer', name: 'PRINTER', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=2000&auto=format&fit=crop', description: 'Printers, scanners, copiers' },
        { id: 'camera', name: 'CAMERA', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=2000&auto=format&fit=crop', description: 'Cameras, webcams, camcorders' },
        { id: 'audio-device', name: 'AUDIO DEVICE', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2000&auto=format&fit=crop', description: 'Headphones, speakers, earphones' },
        { id: 'smart-watch', name: 'SMART WATCH', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2000&auto=format&fit=crop', description: 'Smart watches, fitness trackers' },
        { id: 'gaming-console', name: 'GAMING CONSOLE', image: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=2000&auto=format&fit=crop', description: 'PlayStation, Xbox, Nintendo' },
        { id: 'battery-charger', name: 'BATTERY & CHARGER', image: 'https://images.unsplash.com/photo-1620288627223-53302f4e8c74?q=80&w=2000&auto=format&fit=crop', description: 'Batteries, chargers, power banks' },
        { id: 'other-electronics', name: 'OTHER ELECTRONICS', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop', description: 'Other electronic devices' },
    ];

    const handleItemSelect = (item) => {
        navigate(`/user/raise-ticket/form/${optionId}/${item.id}`);
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-12 animate-fadeIn">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
                    {/* Background Soft Glow */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-slate-50 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>

                    <div className="flex items-center gap-6 mb-12 relative z-10">
                        <button
                            onClick={() => navigate('/user/home')}
                            className="p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all shadow-sm hover:shadow active:scale-95"
                        >
                            <FaArrowLeft className="text-slate-700 text-lg" />
                        </button>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-[900] text-slate-800 tracking-tight leading-none uppercase">Recycle & Earn</h2>
                            <p className="text-slate-400 font-extrabold uppercase text-[8px] tracking-[0.2em]">SELECT THE ELECTRONIC ITEM YOU WANT TO RECYCLE:</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 relative z-10">
                        {electronicItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleItemSelect(item)}
                                className="flex flex-col items-center justify-center p-4 h-[18rem] rounded-[2.5rem] border-2 border-slate-50 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all duration-500 group bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="w-full h-28 mb-4 rounded-xl overflow-hidden relative">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                                <h4 className="text-[11px] font-[900] text-slate-800 mb-2 group-hover:text-emerald-900 tracking-tight uppercase leading-tight text-center px-1">
                                    {item.name}
                                </h4>
                                <p className="text-[8px] text-slate-400 text-center font-bold leading-relaxed px-2 group-hover:text-slate-500 line-clamp-2">
                                    {item.description}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategorySelectionPage;
