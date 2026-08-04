/**
 * Mock AI Service for E-Waste Identification
 * In production, this would be replaced with a real ML model API.
 */

const WASTE_CATEGORIES = [
    {
        id: 'motherboard',
        name: 'Motherboard / PCB',
        ecoPoints: 150,
        tip: 'Contains precious metals like gold and silver. Best sent to specialized smelters.',
        materials: ['Copper', 'Gold', 'Silicon', 'Glass Fibers']
    },
    {
        id: 'display',
        name: 'LCD / LED Display',
        ecoPoints: 100,
        tip: 'Contains liquid crystals and glass. Handle with care to avoid breakage.',
        materials: ['Glass', 'Plastic', 'Liquid Crystals', 'Indium']
    },
    {
        id: 'battery',
        name: 'Lithium Battery',
        ecoPoints: 200,
        tip: 'Highly flammable. Never dispose of in regular trash. Fire hazard!',
        materials: ['Lithium', 'Cobalt', 'Graphite', 'Copper']
    },
    {
        id: 'cable',
        name: 'Power Cables / Wires',
        ecoPoints: 50,
        tip: 'Valuable copper content. Insulation can be recycled into plastic pellets.',
        materials: ['Copper', 'PVC Insulation', 'Aluminum']
    },
    {
        id: 'harddrive',
        name: 'Hard Disk Drive',
        ecoPoints: 120,
        tip: 'Contains strong neodymium magnets. Ensure data destruction before recycling.',
        materials: ['Aluminum', 'Steel', 'Neodymium', 'Platters']
    }
];

export const analyzeImage = async (imageUrl) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 2000));

    // For demonstration, we'll pick a random category
    // In a real app, you might use image analysis results here
    const randomIndex = Math.floor(Math.random() * WASTE_CATEGORIES.length);
    const category = WASTE_CATEGORIES[randomIndex];

    return {
        success: true,
        detectedItem: category.name,
        confidence: (Math.random() * 15 + 80).toFixed(2), // 80-95% confidence
        ecoPoints: category.ecoPoints,
        recyclingTip: category.tip,
        materials: category.materials,
        timestamp: new Date().toISOString()
    };
};
