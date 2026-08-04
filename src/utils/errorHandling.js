/**
 * Error Handling Utilities
 * Centralized logic for parsing and logging errors.
 * @module errorHandling
 */

/**
 * Extracts a user-friendly error message from various error objects (Firebase, JS Error, etc.).
 * 
 * @param {Error|Object|string} error - The error object.
 * @returns {string} Readable error message.
 */
export const getErrorMessage = (error) => {
    if (!error) return 'An unknown error occurred.';

    if (typeof error === 'string') return error;

    // Firebase Auth Errors
    if (error.code) {
        switch (error.code) {
            case 'auth/user-not-found':
                return 'No user found with this email.';
            case 'auth/wrong-password':
                return 'Incorrect password.';
            case 'auth/email-already-in-use':
                return 'This email is already registered.';
            case 'auth/weak-password':
                return 'Password should be at least 6 characters.';
            case 'auth/invalid-email':
                return 'Invalid email address.';
            case 'permission-denied':
                return 'You do not have permission to perform this action.';
            default:
                return error.message || 'A service error occurred.';
        }
    }

    return error.message || 'Something went wrong.';
};

/**
 * Logs errors to the console (or a monitoring service in production).
 * 
 * @param {Error} error - The error to log.
 * @param {string} [context='App'] - Context/Component name.
 */
export const logError = (error, context = 'App') => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] [${context} Error]:`, error);
    // TODO: Send to Sentry or Analytics
};
