/**
 * Application Constants
 * @module constants
 */

/**
 * User Roles available in the application
 * @enum {string}
 */
export const ROLES = {
    USER: 'user',
    COLLECTOR: 'collector',
    GOVERNMENT: 'government', // Municipal Corporation
};

/**
 * Common status values for requests, orders, etc.
 * @enum {string}
 */
export const STATUS = {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    IN_TRANSIT: 'in_transit',
};

/**
 * Configuration settings for the application
 */
export const APP_CONFIG = {
    PAGINATION_LIMIT: 10,
    TOAST_DURATION: 3000,
    MAX_FILE_SIZE_MB: 5,
    SUPPORT_EMAIL: 'support@esuraksha.com',
    CURRENCY_SYMBOL: '₹',
};

/**
 * Firestore Collection Names
 */
export const COLLECTIONS = {
    USERS: 'users',
    REQUESTS: 'requests',
    PRODUCTS: 'products',
    NOTIFICATIONS: 'notifications',
    GIFT_CODES: 'gift_codes',
    LOGISTICS: 'logistics',
    TICKETS: 'tickets',
    ASSIGNMENTS: 'assignments',
    COLLECTIONS_COLL: 'collections',
};
