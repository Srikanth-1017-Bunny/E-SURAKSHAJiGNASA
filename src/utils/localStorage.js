/**
 * LocalStorage Utilities
 * Safe wrapper for localStorage operations with JSON parsing.
 * @module localStorage
 */

const storage = {
    /**
     * Get a value from localStorage.
     * Automatically JSON parses the value if possible.
     * 
     * @param {string} key - The key to retrieve.
     * @param {*} [defaultValue=null] - Value to return if key doesn't exist.
     * @returns {*} The stored value or default.
     */
    get: (key, defaultValue = null) => {
        try {
            const item = window.localStorage.getItem(key);
            if (item === null) return defaultValue;

            try {
                return JSON.parse(item);
            } catch (e) {
                return item; // Return as string if parsing fails
            }
        } catch (error) {
            console.error(`Error reading key "${key}" from localStorage:`, error);
            return defaultValue;
        }
    },

    /**
     * Set a value in localStorage.
     * Automatically stringifies objects.
     * 
     * @param {string} key - Key to set.
     * @param {*} value - Value to store.
     */
    set: (key, value) => {
        try {
            const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
            window.localStorage.setItem(key, serialized);
        } catch (error) {
            console.error(`Error writing key "${key}" to localStorage:`, error);
        }
    },

    /**
     * Remove a key from localStorage.
     * 
     * @param {string} key - The key to remove.
     */
    remove: (key) => {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing key "${key}" from localStorage:`, error);
        }
    },

    /**
     * Clear all localStorage.
     */
    clear: () => {
        try {
            window.localStorage.clear();
        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }
    }
};

export default storage;
