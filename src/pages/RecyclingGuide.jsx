import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    AlertTriangle,
    X,
    Info,
    Trash2,
    Zap,
    Smartphone,
    Cpu,
    Monitor,
    Battery,
    MousePointer2,
    Lightbulb,
    ArrowLeft,
    Thermometer,
    Printer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecyclingGuide = () => {
    const navigate = useNavigate();
    const [selectedItem, setSelectedItem] = useState(null);

    const recyclableItems = [
        {
            id: 'laptop',
            name: 'Old Laptops',
            description: 'Contains valuable metals like gold, silver, and palladium.',
            fullDetails: 'Laptops are highly recyclable. Over 90% of their components can be recovered, including aluminum casings, plastic shells, and precious metals on motherboards.',
            dangerLevel: 'Low',
            img: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800',
            icon: <Monitor className="text-emerald-500" />
        },
        {
            id: 'phone',
            name: 'Smartphones',
            description: 'Compact devices with high concentrations of rare metals.',
            fullDetails: 'A typical smartphone contains around 60 different elements. Recycling recovers cobalt from batteries, gold from circuits, and high-grade plastics.',
            dangerLevel: 'Low',
            img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800',
            icon: <Smartphone className="text-emerald-500" />
        },
        {
            id: 'tablet',
            name: 'Tablets',
            description: 'Large glass and battery units with recoverable silicon.',
            fullDetails: 'Tablets contain large lithium-ion batteries and high-purity glass. Recycling allows for the recovery of rare earth magnets and high-value silicon.',
            dangerLevel: 'Low',
            img: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800',
            icon: <Smartphone className="text-emerald-500" />
        },
        {
            id: 'console',
            name: 'Game Consoles',
            description: 'Dense circuit boards rich in copper and gold.',
            fullDetails: 'Consoles like PlayStations have dense motherboards rich in copper and gold. Their plastic housings are durable ABS that can be recycled.',
            dangerLevel: 'Low',
            img: 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?q=80&w=800',
            icon: <Cpu className="text-emerald-500" />
        },
        {
            id: 'keyboard',
            name: 'Keyboards & Mice',
            description: 'ABS plastics and copper wiring separation.',
            fullDetails: 'Peripherals contain significant amounts of ABS plastics and copper cabling. These materials are shredded and separated by density.',
            dangerLevel: 'None',
            img: 'https://images.unsplash.com/photo-1541140532154-b024d715b909?q=80&w=800',
            icon: <MousePointer2 className="text-emerald-500" />
        },
        {
            id: 'modem',
            name: 'Modems & Routers',
            description: 'Communication chips and high-frequency circuitry.',
            fullDetails: 'Network equipment contains specialized communication chips and high-grade capacitors that are recycled for their metal content.',
            dangerLevel: 'None',
            img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800',
            icon: <Zap className="text-emerald-500" />
        },
        {
            id: 'cables',
            name: 'Cables & Wires',
            description: 'High recovery value for pure copper.',
            fullDetails: 'Wires are stripped of insulation to recover high-purity copper and aluminum. The insulation is often repurposed in construction.',
            dangerLevel: 'None',
            img: 'https://images.unsplash.com/photo-1558434751-6444e9b60231?q=80&w=800',
            icon: <Zap className="text-emerald-500" />
        },
        {
            id: 'printer',
            name: 'Printers & Scanners',
            description: 'Complex machines with valuable motors and optics.',
            fullDetails: 'Printers contain high-torque stepper motors, optical scanners, and specialized circuit boards. The plastic shells are high-grade and recyclable.',
            dangerLevel: 'Low',
            img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800',
            icon: <Printer className="text-emerald-500" />
        }
    ];

    const toxicItems = [
        {
            id: 'batteries',
            name: 'Lithium Batteries',
            description: 'Highly flammable and reactive chemicals.',
            fullDetails: 'Lithium batteries are fire hazards if punctured. They contain lithium, cobalt, and nickel. Leaking heavy metals can poison water tables.',
            dangerLevel: 'Extreme',
            img: 'https://images.unsplash.com/photo-1599839619722-39751411883e?q=80&w=800',
            icon: <Battery className="text-rose-500" />
        },
        {
            id: 'crt',
            name: 'CRT Monitors',
            description: 'Contains pounds of neurotoxic lead glass.',
            fullDetails: 'Old tube-style TVs contain high levels of lead glass to block X-rays. Breaking them releases toxic dust into the environment.',
            dangerLevel: 'High',
            img: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800',
            icon: <Monitor className="text-rose-500" />
        },
        {
            id: 'lcd_broken',
            name: 'Broken LCD/LEDs',
            description: 'Mercury backlights and liquid crystal leaks.',
            fullDetails: 'Modern flat screens contain liquid crystals and mercury vapors in CCFL backlights. When cracked, these substances pose respiratory risks.',
            dangerLevel: 'High',
            img: 'https://images.unsplash.com/photo-1516216628859-9bccecad13fc?q=80&w=800',
            icon: <Monitor className="text-rose-500" />
        },
        {
            id: 'cfl',
            name: 'CFL Bulbs',
            description: 'Mercury vapor that is highly neurotoxic.',
            fullDetails: 'Compact Fluorescent Lamps contain mercury. If broken, the vapor can be inhaled, posing serious health risks to humans and animals.',
            dangerLevel: 'High',
            img: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=800',
            icon: <Lightbulb className="text-rose-500" />
        },
        {
            id: 'ink',
            name: 'Ink/Toner Cartridges',
            description: 'Toxic ink residues and flame retardants.',
            fullDetails: 'Printer cartridges contain residual ink pigments that are harmful if they leach. The plastics use toxic flame retardants.',
            dangerLevel: 'Medium',
            img: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=800',
            icon: <Trash2 className="text-rose-500" />
        },
        {
            id: 'pcbs',
            name: 'Older PCB Boards',
            description: 'Leachable lead-based solder and chemicals.',
            fullDetails: 'Pre-2006 circuit boards often use lead-based solder. If shredded improperly, lead particles can contaminate soil and water systems.',
            dangerLevel: 'Medium',
            img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800',
            icon: <Cpu className="text-rose-500" />
        },
        {
            id: 'smoke',
            name: 'Smoke Detectors',
            description: 'Contains radioactive Americium-241.',
            fullDetails: 'Ionization smoke detectors contain americium-241, a radioactive isotope. They must be handled as radioactive hazardous waste.',
            dangerLevel: 'High',
            img: 'https://images.unsplash.com/photo-1585822310137-43cf0034a706?q=80&w=800',
            icon: <AlertTriangle className="text-rose-500" />
        },
        {
            id: 'mercury',
            name: 'Mercury Thermostats',
            description: 'Toxic mercury bulbs that pose long-term risks.',
            fullDetails: 'Older thermostats contain a glass bulb with liquid mercury. If broken, the mercury evaporates and can cause serious neurological damage if inhaled.',
            dangerLevel: 'High',
            img: 'https://images.unsplash.com/photo-1584622781564-1d9876a1df8e?q=80&w=800',
            icon: <Thermometer className="text-rose-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                    <div>
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold mb-4 transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
                        </button>
                        <h1 className="text-4xl md:text-5xl font-[1000] text-slate-900 tracking-tighter mb-2">
                            Recycling Awareness <span className="text-emerald-500">Guide</span>
                        </h1>
                        <p className="text-slate-500 font-medium max-w-2xl">
                            E-waste isn't just trash; it's a mix of valuable resources and hazardous toxins. Learn what happens when you recycle responsibly.
                        </p>
                    </div>

                    <div className="flex gap-4 p-2 bg-white rounded-2xl border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm">
                            <CheckCircle2 size={16} /> Recyclable
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-xl font-bold text-sm">
                            <AlertTriangle size={16} /> Toxic/Dangerous
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Recyclable Section */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Recyclable Items</h2>
                                <p className="text-slate-500 text-sm font-bold">Safe to process and reclaim value</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {recyclableItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="group relative cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50"
                                >
                                    <div className="h-40 overflow-hidden relative">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-lg font-black text-slate-900 mb-1">{item.name}</h3>
                                        <p className="text-slate-500 text-sm font-medium line-clamp-2">{item.description}</p>
                                        <div className="mt-4 flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
                                            Learn More <Info size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Toxic Section */}
                    <motion.section
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-900">Non-Recyclable Toxic Items</h2>
                                <p className="text-slate-500 text-sm font-bold">Hazardous - Requires specialist handling</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {toxicItems.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -5 }}
                                    onClick={() => setSelectedItem(item)}
                                    className="group relative cursor-pointer bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50"
                                >
                                    <div className="h-40 overflow-hidden relative">
                                        <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-rose-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm text-rose-500">
                                            {item.icon}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-lg font-black text-slate-900">{item.name}</h3>
                                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg uppercase">
                                                {item.dangerLevel}
                                            </span>
                                        </div>
                                        <p className="text-slate-500 text-sm font-medium line-clamp-2">{item.description}</p>
                                        <div className="mt-4 flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest">
                                            View Risks <Info size={14} />
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                </div>

                {/* Footnote */}
                <div className="mt-16 p-8 bg-emerald-900 rounded-[3rem] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <Cpu size={120} />
                    </div>
                    <div className="relative z-10 max-w-2xl">
                        <h3 className="text-2xl font-black mb-4 tracking-tighter">Why awareness matters?</h3>
                        <p className="text-emerald-100/80 font-medium leading-relaxed">
                            Only 17.4% of e-waste is documented as being properly collected and recycled. By understanding what's in your gadgets, you help prevent millions of tons of pollutants from poisoning our Earth and reclaim billions in raw material value.
                        </p>
                    </div>
                </div>
            </div>

            {/* Modal Detail Overlay */}
            <AnimatePresence>
                {selectedItem && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedItem(null)}
                            className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-3xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-6 right-6 p-2 bg-slate-900/5 hover:bg-slate-900/10 rounded-full text-slate-900 z-50 transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2">
                                <div className="h-64 md:h-full">
                                    <img src={selectedItem.img} alt={selectedItem.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-8 md:p-12">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedItem.dangerLevel ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                            {selectedItem.icon}
                                        </div>
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{selectedItem.name}</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">The Breakdown</h4>
                                            <p className="text-slate-600 font-medium leading-relaxed">
                                                {selectedItem.fullDetails}
                                            </p>
                                        </div>

                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-black text-slate-900">Environmental Impact</span>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${selectedItem.dangerLevel === 'Extreme' ? 'bg-rose-500 text-white' :
                                                    selectedItem.dangerLevel === 'High' ? 'bg-orange-500 text-white' :
                                                        selectedItem.dangerLevel === 'Medium' ? 'bg-amber-500 text-white' :
                                                            'bg-emerald-500 text-white'
                                                    }`}>
                                                    {selectedItem.dangerLevel || 'Safe'}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate('/user/raise-ticket/category/income')}
                                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                                        >
                                            Recycle this now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default RecyclingGuide;
