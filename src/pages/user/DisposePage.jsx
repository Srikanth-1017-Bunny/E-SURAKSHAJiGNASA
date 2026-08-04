import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Smartphone, Laptop, Tv, ShieldAlert, Check, ArrowRight, ArrowLeft,
    MapPin, Upload, RefreshCw, Sparkles, Trash2, ShieldCheck, Clock, Award,
    Wind, Microwave, Camera, Printer, Headphones, Watch
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, addDoc, getDocs, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../utils/firebase';
import AddressSelector from '../../components/common/AddressSelector';
import ImageUploader from '../../components/common/ImageUploader';
import { analyzeImage } from '../../services/aiService';
import { toast } from 'react-toastify';

// Categories List
const CATEGORIES = [
    { id: 'Mobile', name: 'Mobile Phone', icon: Smartphone, baseValue: 1000, desc: 'Smartphones, iPhones, Keypad phones', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=600&auto=format&fit=crop' },
    { id: 'Laptop', name: 'Laptop', icon: Laptop, baseValue: 3000, desc: 'Laptops, Notebooks, MacBooks', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop' },
    { id: 'Television', name: 'Television', icon: Tv, baseValue: 2000, desc: 'LED, LCD, CRT Televisions', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=600&auto=format&fit=crop' },
    { id: 'Refrigerator', name: 'Refrigerator', icon: ShieldAlert, baseValue: 4000, desc: 'Single door, Double door, Deep freezers', image: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?q=80&w=600&auto=format&fit=crop' },
    { id: 'Washing Machine', name: 'Washing Machine', icon: RefreshCw, baseValue: 3500, desc: 'Front load, Top load washing machines', image: 'https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=600&auto=format&fit=crop' },
    { id: 'Air Conditioner', name: 'Air Conditioner', icon: Wind, baseValue: 5000, desc: 'Split AC, Window AC, Inverter AC', image: 'https://images.unsplash.com/photo-1607590821815-5853fcf442a8?q=80&w=600&auto=format&fit=crop' },
    { id: 'Microwave', name: 'Microwave', icon: Microwave, baseValue: 1500, desc: 'Solo, Grill, Convection Microwaves', image: 'https://images.unsplash.com/photo-1585659722983-38ca8e89f928?q=80&w=600&auto=format&fit=crop' },
    { id: 'Camera', name: 'Camera', icon: Camera, baseValue: 4000, desc: 'DSLR, Mirrorless, Point & Shoot', image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=600&auto=format&fit=crop' },
    { id: 'Printer', name: 'Printer', icon: Printer, baseValue: 1200, desc: 'Laser, Inkjet, All-in-One Printers', image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?q=80&w=600&auto=format&fit=crop' },
    { id: 'Audio', name: 'Audio Devices', icon: Headphones, baseValue: 800, desc: 'Headphones, Earbuds, Speakers', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop' },
    { id: 'Wearable', name: 'Smartwatch', icon: Watch, baseValue: 1000, desc: 'Smartwatches, Fitness Bands', image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=600&auto=format&fit=crop' }
];

// Haversine formula to find distance in kilometers between two points
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const DisposePage = () => {
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    // Steps: 1 = Category Selection, 2 = Brand & Model, 3 = Assessment Questions, 4 = Value & Grade (Image Upload), 5 = Address & Submit, 6 = Success Screen
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form Data
    const [category, setCategory] = useState(null);
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [image, setImage] = useState('');
    const [aiScanning, setAiScanning] = useState(false);
    const [aiResult, setAiResult] = useState(null);
    const [location, setLocation] = useState(currentUser?.address || { street: '', city: '', state: '', pincode: '', lat: 17.3850, lng: 78.4867 });

    // Flipkart-style Condition Grades
    const [deviceCondition, setDeviceCondition] = useState('Flawless');

    // For brand expansion UI
    const [expandedBrand, setExpandedBrand] = useState(null);

    // Success state
    const [createdTicket, setCreatedTicket] = useState(null);

    const handleCategorySelect = (cat) => {
        setCategory(cat);
        setStep(2);
    };

    const handleConditionChange = (condition) => {
        setDeviceCondition(condition);
    };

    // Calculate Recycling Value and Grade
    const calculateValueAndGrade = () => {
        if (!category) return { value: 0, grade: 'Scrap' };

        const base = category.baseValue;
        let multiplier = 1.0;
        let grade = 'Grade A';

        switch (deviceCondition) {
            case 'Flawless':
                multiplier = 1.0;
                grade = 'Grade A+';
                break;
            case 'Good':
                multiplier = 0.90;
                grade = 'Grade A';
                break;
            case 'Average':
                multiplier = 0.75;
                grade = 'Grade B';
                break;
            case 'Below Average':
                multiplier = 0.50;
                grade = 'Grade C';
                break;
            default:
                multiplier = 1.0;
        }

        const estimatedValue = Math.round(base * multiplier);
        return { value: estimatedValue, grade };
    };

    const { value: estimatedValue, grade: calculatedGrade } = calculateValueAndGrade();

    // Top Brands List by Category
    const TOP_BRANDS = {
        'Mobile Phone': ['Apple', 'Mi', 'Motorola', 'OnePlus', 'Oppo', 'Poco', 'Realme', 'Samsung', 'Vivo'],
        'Laptop': ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Samsung'],
        'Television': ['Samsung', 'LG', 'Sony', 'Mi', 'TCL', 'OnePlus', 'Panasonic'],
        'Refrigerator': ['Samsung', 'LG', 'Whirlpool', 'Godrej', 'Haier', 'Bosch'],
        'Washing Machine': ['Samsung', 'LG', 'Whirlpool', 'Bosch', 'IFB', 'Panasonic'],
        'Air Conditioner': ['Voltas', 'Daikin', 'LG', 'Samsung', 'Hitachi', 'Blue Star', 'Lloyd'],
        'Microwave': ['LG', 'Samsung', 'Panasonic', 'Whirlpool', 'IFB', 'Godrej', 'Morphy Richards'],
        'Camera': ['Canon', 'Nikon', 'Sony', 'Panasonic', 'Fujifilm', 'GoPro', 'Olympus'],
        'Printer': ['HP', 'Canon', 'Epson', 'Brother', 'Samsung', 'Ricoh', 'Xerox'],
        'Audio Devices': ['Sony', 'JBL', 'Bose', 'Sennheiser', 'boAt', 'Apple', 'Skullcandy'],
        'Smartwatch': ['Apple', 'Samsung', 'Garmin', 'Fitbit', 'Noise', 'Fossil', 'Amazfit']
    };

    // AI Scanner simulation
    const handleImageUpload = async (url) => {
        setImage(url);
        setAiScanning(true);
        try {
            const result = await analyzeImage(url);
            setAiResult(result);
            toast.success("AI Scan Complete!");
        } catch (error) {
            toast.error("AI Analysis failed. Proceeding with manual values.");
        } finally {
            setAiScanning(false);
        }
    };

    // Submitting the E-Waste Ticket
    const handleSubmitTicket = async () => {
        if (!location || !location.street) {
            toast.warning("Please specify a pickup address");
            return;
        }
        setSubmitting(true);
        try {
            const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
            const ticketData = {
                ticketId,
                userId: currentUser.uid,
                userName: currentUser.displayName || currentUser.email.split('@')[0],
                userEmail: currentUser.email,
                userPhone: currentUser.phone || '',
                deviceCategory: category.id,
                deviceBrand: brand,
                deviceModel: model,
                deviceCondition,
                estimatedValue,
                grade: calculatedGrade,
                pickupAddress: `${location.street}, ${location.city}, ${location.state} - ${location.pincode}`,
                location: { lat: location.lat || 17.3850, lng: location.lng || 78.4867 },
                createdAt: new Date(),
                status: 'Submitted',
                assignedTime: null,
                pickupTime: null,
                completionTime: null,
                collectorId: null,
                collectorName: null,
                image: image || null
            };

            // 1. Save Ticket
            const docRef = await addDoc(collection(db, 'tickets'), ticketData);
            let assignedCollector = null;

            /* 
            // Optional: Smart Assignment Engine is disabled so tickets go to Municipal Dashboard
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const collectors = [];
            usersSnapshot.forEach(docSnap => {
                const u = docSnap.data();
                if (u.role === 'collector' && u.address?.lat) {
                    collectors.push({ uid: docSnap.id, ...u });
                }
            });

            if (collectors.length > 0) {
                // Calculate distance to each collector
                let nearest = null;
                let minDistance = Infinity;

                collectors.forEach(col => {
                    const dist = getDistanceKm(
                        location.lat || 17.3850,
                        location.lng || 78.4867,
                        col.address.lat,
                        col.address.lng
                    );
                    if (dist < minDistance) {
                        minDistance = dist;
                        nearest = col;
                    }
                });

                if (nearest) {
                    assignedCollector = nearest;
                    // Update Ticket with Collector details
                    await updateDoc(doc(db, 'tickets', docRef.id), {
                        status: 'Assigned',
                        collectorId: nearest.uid,
                        collectorName: nearest.name,
                        assignedTime: new Date()
                    });

                    // Add Notification for Collector
                    await addDoc(collection(db, 'notifications'), {
                        userId: nearest.uid,
                        title: "New E-Waste Collection Assigned",
                        message: `You have been assigned to collect ${brand} ${model} from ${location.city}.`,
                        type: 'info',
                        read: false,
                        createdAt: new Date()
                    });

                    // Add Notification for Citizen
                    await addDoc(collection(db, 'notifications'), {
                        userId: currentUser.uid,
                        title: "Collector Assigned",
                        message: `Collector ${nearest.name} has been assigned to pick up your ${brand} ${model}.`,
                        type: 'success',
                        read: false,
                        createdAt: new Date()
                    });
                }
            }
            */

            // Set state for Success screen
            setCreatedTicket({
                id: docRef.id,
                ...ticketData,
                status: 'Submitted',
                collectorId: null,
                collectorName: null,
                collectorLat: null,
                collectorLng: null
            });

            toast.success("E-Waste Ticket submitted successfully!");
            setStep(6);
        } catch (error) {
            console.error("Error creating ticket:", error);
            toast.error("Failed to submit ticket. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {/* STEP 1: CATEGORY SELECTION */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                        >
                            <div className="text-center max-w-xl mx-auto mb-10">
                                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Dispose E-Waste</h1>
                                <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-2">Select the category of the electronic device you want to recycle</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {CATEGORIES.map(cat => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => handleCategorySelect(cat)}
                                            className="relative flex flex-col justify-end p-6 h-60 rounded-3xl overflow-hidden transition-all duration-300 group shadow-sm hover:shadow-xl active:scale-[0.98] border border-slate-200"
                                        >
                                            <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div>
                                            <div className="relative z-10 text-left flex flex-col items-start w-full">
                                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:bg-emerald-500 group-hover:scale-110">
                                                    <Icon size={24} />
                                                </div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight mb-1">{cat.name}</h3>
                                                <p className="text-xs text-slate-300 font-bold line-clamp-2">{cat.desc}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BRAND & MODEL */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-8 border-b pb-4">
                                <button onClick={() => setStep(1)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Exchange Old {category?.name}</h2>
                                </div>
                            </div>

                            <div className="max-w-2xl mx-auto">
                                <h3 className="text-lg font-bold text-slate-800 mb-2">Which {category?.name?.toLowerCase()} do you have?</h3>
                                <p className="text-xs text-slate-500 mb-6">Top Brands (Extra off on exchange for selected models)</p>

                                <div className="space-y-3">
                                    {TOP_BRANDS[category?.name || 'Mobile Phone']?.map((b) => (
                                        <div key={b} className="border rounded-xl overflow-hidden shadow-sm">
                                            <button 
                                                className="w-full p-4 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                                                onClick={() => {
                                                    setBrand(b);
                                                    setExpandedBrand(expandedBrand === b ? null : b);
                                                }}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                                                        {b.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-slate-800">{b}</span>
                                                </div>
                                                <div className="text-slate-400">
                                                    <svg className={`w-5 h-5 transition-transform ${expandedBrand === b ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                </div>
                                            </button>
                                            
                                            {/* Expandable Model Input Section */}
                                            {expandedBrand === b && (
                                                <div className="p-4 bg-slate-50 border-t border-slate-100">
                                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Enter Model</label>
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="text" 
                                                            placeholder={`e.g. ${b} Model 123`}
                                                            className="flex-1 px-4 py-3 rounded-lg border-slate-200 border focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                                                            value={brand === b ? model : ''}
                                                            onChange={(e) => setModel(e.target.value)}
                                                        />
                                                        <button 
                                                            onClick={() => {
                                                                if(!model) {
                                                                    toast.warning('Please enter the model details');
                                                                    return;
                                                                }
                                                                setStep(3);
                                                            }}
                                                            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                                                        >
                                                            Next
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    <div className="mt-4 pt-4 border-t text-center">
                                        <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                                            Other Brands / Not listed here
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: FLIPKART STYLE DEVICE CONDITION */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-8 border-b pb-4">
                                <button onClick={() => setStep(2)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Device condition</h2>
                                </div>
                            </div>

                            <div className="max-w-xl mx-auto space-y-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-6">How is your {category?.name?.toLowerCase()} condition?</h3>

                                {[
                                    { id: 'Flawless', title: 'Flawless', desc: 'No defects', mult: 1.0 },
                                    { id: 'Good', title: 'Good', desc: 'Minor scratches, dents', mult: 0.90 },
                                    { id: 'Average', title: 'Average', desc: 'Screen or body defects', mult: 0.75 },
                                    { id: 'Below Average', title: 'Below Average', desc: 'Both screen & body defects or functional defects', mult: 0.50 }
                                ].map((cond) => (
                                    <div 
                                        key={cond.id}
                                        onClick={() => handleConditionChange(cond.id)}
                                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all ${
                                            deviceCondition === cond.id 
                                            ? 'border-emerald-600 bg-emerald-50/30' 
                                            : 'border-slate-200 hover:border-emerald-300'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${deviceCondition === cond.id ? 'border-emerald-600' : 'border-slate-300'}`}>
                                                    {deviceCondition === cond.id && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600"></div>}
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-slate-800 font-semibold">{cond.title}</h4>
                                                <p className="text-slate-500 text-sm mt-0.5">{cond.desc}</p>
                                                <p className="text-emerald-600 text-sm font-bold mt-2">UPTO ₹{Math.round(category?.baseValue * cond.mult)}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="pt-6">
                                    <p className="text-center text-xs text-slate-500 mb-4">Final price will be determined at doorstep basis device condition</p>
                                    <button
                                        onClick={() => setStep(4)}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors shadow-lg"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 4: EXCHANGE SUMMARY & IMAGE UPLOAD */}
                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-8 border-b pb-4">
                                <button onClick={() => setStep(3)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-800">Exchange Summary</h2>
                                </div>
                            </div>

                            <div className="max-w-2xl mx-auto space-y-8">
                                <div className="flex justify-between items-start bg-slate-50 p-6 rounded-2xl">
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Your product</p>
                                        <p className="font-bold text-slate-800 text-lg uppercase">{brand} {model}</p>
                                        <div className="mt-4">
                                            <p className="text-sm text-slate-500">Green Coins Reward upto</p>
                                            <p className="text-4xl font-black text-emerald-600">{estimatedValue}</p>
                                        </div>
                                    </div>
                                    <div className="w-24 h-24 bg-white rounded-xl border flex items-center justify-center p-2 shadow-sm">
                                        <category.icon className="w-12 h-12 text-slate-400" />
                                    </div>
                                </div>

                                <div>
                                    <button onClick={() => setStep(3)} className="text-blue-600 font-semibold hover:underline">
                                        Review your answers
                                    </button>
                                </div>

                                <div className="border-t pt-6">
                                    <h3 className="font-bold text-slate-800 text-lg mb-6">How Exchange Works</h3>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                                        {[
                                            { step: 1, text: `Your ${category?.name?.toLowerCase()}'s physical & functional condition will be checked at doorstep. Based on that, the price can vary.` },
                                            { step: 2, text: 'For checking the condition, an evaluation process will be carried out. This process takes around 20-30min. Reset before you handover the device.' },
                                            { step: 3, text: 'It\'s recommended to give internet connection, have battery charged to minimum 50% & remove covers for fair evaluation.' },
                                            { step: 4, text: 'If you do not like the doorstep value, you can cancel the request at no cost.' }
                                        ].map((item) => (
                                            <div key={item.step} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white bg-slate-100 text-slate-600 font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-0 z-10">
                                                    {item.step}
                                                </div>
                                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-100 bg-white shadow-sm">
                                                    <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t pt-6">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1 block">Device Image (Optional but Recommended)</label>
                                    {!image ? (
                                        <ImageUploader
                                            onUpload={handleImageUpload}
                                            label="Select device image"
                                            sublabel="Helps with remote AI assessment"
                                        />
                                    ) : (
                                        <div className="relative rounded-2xl overflow-hidden shadow-md border-2 border-slate-100 group max-w-sm">
                                            <img src={image} alt="Device" className="w-full h-48 object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    onClick={() => { setImage(''); setAiResult(null); }}
                                                    className="p-3 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {aiScanning && (
                                        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center gap-3 animate-pulse max-w-sm">
                                            <RefreshCw className="animate-spin text-indigo-600" size={18} />
                                            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">AI Identification Scanner Active...</span>
                                        </div>
                                    )}

                                    {aiResult && (
                                        <div className="mt-4 p-5 bg-emerald-50 border border-emerald-100 rounded-2xl max-w-sm shadow-sm relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/10 rounded-bl-full -z-0"></div>
                                            <div className="flex items-center gap-2 text-emerald-800 mb-3 relative z-10">
                                                <div className="p-1.5 bg-emerald-100 rounded-lg"><Sparkles size={16} /></div>
                                                <span className="text-xs font-black uppercase tracking-wider">AI Scanner Breakdown</span>
                                            </div>
                                            <p className="text-[11px] font-bold text-slate-500 mb-3 relative z-10">
                                                Detected: <span className="text-slate-900 font-extrabold text-sm">{aiResult.detectedItem}</span>
                                                <span className="ml-2 text-[10px] text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">{aiResult.confidence}% match</span>
                                            </p>
                                            
                                            {aiResult.materials && aiResult.materials.length > 0 && (
                                                <div className="bg-white rounded-xl p-3 border border-emerald-50 relative z-10">
                                                    <p className="text-[10px] font-black uppercase text-slate-400 mb-2">Recyclable Components Found:</p>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {aiResult.materials.map((mat, idx) => (
                                                            <span key={idx} className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                                                                {mat}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            
                                            {aiResult.ecoPoints && (
                                                <div className="mt-3 flex items-center justify-between border-t border-emerald-100 pt-3 relative z-10">
                                                    <span className="text-xs font-bold text-slate-600">Estimated Eco-Points</span>
                                                    <span className="text-lg font-black text-emerald-600">+{aiResult.ecoPoints}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 flex flex-col gap-4">
                                    <div className="flex items-center gap-2">
                                        <input type="checkbox" id="terms" className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" defaultChecked />
                                        <label htmlFor="terms" className="text-sm text-slate-600">I agree to the <span className="text-blue-600 hover:underline cursor-pointer">terms and conditions</span></label>
                                    </div>
                                    <button
                                        onClick={() => setStep(5)}
                                        className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-wide hover:bg-emerald-700 transition-colors shadow-lg"
                                    >
                                        Confirm Exchange
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: ADDRESS & SUBMIT */}
                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100"
                        >
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setStep(4)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                                    <ArrowLeft size={16} />
                                </button>
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Select Pickup Location</h2>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Specify pickup location for smart collector assignment</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <AddressSelector
                                    value={location}
                                    onChange={(addr) => setLocation(addr)}
                                />

                                <button
                                    onClick={handleSubmitTicket}
                                    disabled={submitting}
                                    className="w-full mt-8 py-5 bg-emerald-600 text-white rounded-xl font-black uppercase text-xs tracking-widest hover:bg-emerald-700 transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {submitting ? 'Initiating Smart Assignment...' : 'Confirm & Schedule Disposal'} <Check size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: SUCCESS & TICKET DETAILS */}
                    {step === 6 && createdTicket && (
                        <motion.div
                            key="step6"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl text-center space-y-8"
                        >
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                                <ShieldCheck size={40} />
                            </div>

                            <div className="space-y-2">
                                <h1 className="text-4xl font-[1000] text-slate-900 uppercase tracking-tighter leading-none">Disposal Request Logged!</h1>
                                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ticket ID: {createdTicket.ticketId}</p>
                            </div>

                            {/* Details Panel */}
                            <div className="bg-slate-50 rounded-3xl p-6 text-left max-w-xl mx-auto border border-slate-100 space-y-4">
                                <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider border-b pb-2 mb-2">Ticket Summary</h3>
                                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-500">
                                    <div>
                                        <p className="text-[9px] uppercase text-slate-400">Device</p>
                                        <p className="text-slate-800 font-extrabold text-sm">{createdTicket.deviceBrand} {createdTicket.deviceModel}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase text-slate-400">Grade / Est. Green Coins</p>
                                        <p className="text-emerald-600 font-extrabold text-sm">{createdTicket.grade} • {createdTicket.estimatedValue} Coins</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[9px] uppercase text-slate-400">Address</p>
                                        <p className="text-slate-800 leading-normal">{createdTicket.pickupAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Collector Assignment Block */}
                            {createdTicket.collectorName ? (
                                <div className="max-w-xl mx-auto p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-blue-900 text-sm uppercase tracking-wide">Collector Assigned Instantly!</h4>
                                        <p className="text-slate-600 text-xs mt-0.5"><span className="font-extrabold text-slate-800">{createdTicket.collectorName}</span> is nearby and will collect within 24 hours.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="max-w-xl mx-auto p-6 bg-amber-50 border border-amber-100 rounded-3xl flex items-center gap-4 text-left">
                                    <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <Clock size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-extrabold text-amber-900 text-sm uppercase tracking-wide">Searching for Nearest Collector...</h4>
                                        <p className="text-slate-600 text-xs mt-0.5">We will assign a municipal collector to pick up your device shortly.</p>
                                    </div>
                                </div>
                            )}

                            {/* SLA Tracker Countdown Simulation */}
                            <div className="flex items-center justify-center gap-2 max-w-xs mx-auto px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-black uppercase tracking-widest">
                                <Clock size={14} className="text-emerald-400" />
                                <span>24 Hours SLA countdown started</span>
                            </div>

                            <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                                <button
                                    onClick={() => navigate('/user/home')}
                                    className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs hover:bg-slate-800 transition-colors uppercase tracking-widest"
                                >
                                    Go to Dashboard
                                </button>
                                <button
                                    onClick={() => navigate('/user/requests')}
                                    className="w-full sm:w-auto px-10 py-4 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-xs hover:bg-slate-50 transition-colors uppercase tracking-widest"
                                >
                                    Track Activity
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DisposePage;
