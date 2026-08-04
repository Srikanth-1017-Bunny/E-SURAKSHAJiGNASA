/**
 * Validation Utilities
 * helper functions for form validation and data integrity checks.
 * @module validation
 */

/**
 * Validates an email address format.
 * 
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
export const isValidEmail = (email) => {
    if (!email) return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Validates an Indian phone number (10 digits).
 * 
 * @param {string} phone - The phone number.
 * @returns {boolean} True if valid (10 digits).
 */
export const isValidPhone = (phone) => {
    if (!phone) return false;
    const re = /^[6-9]\d{9}$/; // Starts with 6-9 and is 10 digits
    return re.test(phone);
};

/**
 * Checks if a password meets strength requirements.
 * Requirements: At least 6 characters (simple for now, can be expanded).
 * 
 * @param {string} password - The password.
 * @returns {boolean} True if valid.
 */
export const isMockStrongPassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Validates a pickup request form data object.
 * 
 * @param {Object} data - Form data.
 * @returns {Object} result - { isValid: boolean, errors: Object }
 */
export const validatePickupRequest = (data) => {
    const errors = {};

    if (!data.address || data.address.length < 5) {
        errors.address = "Address is required and must be at least 5 characters.";
    }
    if (!data.items || data.items.length === 0) {
        errors.items = "At least one item must be added.";
    }
    if (!data.date) {
        errors.date = "Pickup date is required.";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
