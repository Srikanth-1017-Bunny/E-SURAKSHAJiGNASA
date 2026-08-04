// Mock data/service for logistics and gift codes

const MOCK_SHIPMENTS = [
    {
        id: 'TRK-987654321',
        recipient: 'EcoCycle Center #4',
        sender: 'John Doe',
        origin: 'Mumbai, MH',
        destination: 'Pune, MH',
        weight: 12.5,
        status: 'In Transit',
        estimatedDelivery: '2023-11-25',
        timeline: [
            { event: 'Shipment Created', time: '2023-11-20 09:00 AM', location: 'Mumbai' },
            { event: 'Picked Up by Collector', time: '2023-11-20 02:30 PM', location: 'Mumbai' },
            { event: 'Arrived at Hub', time: '2023-11-21 10:15 AM', location: 'Navi Mumbai' },
            { event: 'Departed Hub', time: '2023-11-22 06:45 AM', location: 'Navi Mumbai' },
        ]
    },
    {
        id: 'TRK-123456789',
        recipient: 'GreenEarth Recycling',
        sender: 'Sarah Smith',
        origin: 'Bangalore, KA',
        destination: 'Mysore, KA',
        weight: 5.2,
        status: 'Delivered',
        estimatedDelivery: '2023-11-18',
        timeline: [
            { event: 'Shipment Created', time: '2023-11-15 11:00 AM', location: 'Bangalore' },
            { event: 'Picked Up', time: '2023-11-16 01:00 PM', location: 'Bangalore' },
            { event: 'Delivered', time: '2023-11-18 04:20 PM', location: 'Mysore' },
        ]
    },
    {
        id: 'TRK-555555555',
        recipient: 'E-Waste Solutions',
        sender: 'Mike Johnson',
        origin: 'Delhi, DL',
        destination: 'Gurgaon, HR',
        weight: 8.0,
        status: 'Pending Pickup',
        estimatedDelivery: '2023-11-28',
        timeline: [
            { event: 'Shipment Created', time: '2023-11-23 03:00 PM', location: 'Delhi' },
        ]
    }
];

export const logisticsService = {
    getAllShipments: async () => {
        // Simulate API delay
        return new Promise(resolve => setTimeout(() => resolve(MOCK_SHIPMENTS), 800));
    },

    getShipmentById: async (id) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const shipment = MOCK_SHIPMENTS.find(s => s.id === id);
                resolve(shipment || null);
            }, 500);
        });
    },

    createShipment: async (details) => {
        return new Promise(resolve => {
            setTimeout(() => {
                const newId = `TRK-${Math.floor(Math.random() * 1000000000)}`;
                resolve({ id: newId, status: 'Created', ...details });
            }, 800);
        });
    },

    generateGiftCode: (amount) => {
        const prefix = "JIGNASA";
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `${prefix}-${randomString}-${amount}`;
    },

    getGiftCodes: async () => {
        // Mock Gift Codes
        return [
            { code: 'JIGNASA-X7Y8Z9-50', amount: 50, status: 'Active', createdBy: 'Admin', createdAt: new Date().toISOString() },
            { code: 'JIGNASA-A1B2C3-100', amount: 100, status: 'Redeemed', createdBy: 'Admin', createdAt: '2023-11-01T10:00:00Z' },
            { code: 'WELCOM-NEWUSR-25', amount: 25, status: 'Active', createdBy: 'System', createdAt: '2023-11-20T12:00:00Z' },
        ];
    }
};
