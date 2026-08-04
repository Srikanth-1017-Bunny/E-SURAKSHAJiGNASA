/**
 * Formatting Utilities
 * Helpers for displaying data in a human-readable format.
 * @module formatting
 */

/**
 * Formats a number as Indian Rupee (INR) or Eco-Coins.
 * 
 * @param {number} amount - The amount to format.
 * @param {string} [unit='INR'] - The unit to use ('INR' or 'coins').
 * @returns {string} Formatted currency string.
 */
export const formatCurrency = (amount, unit = 'INR') => {
    if (isNaN(amount) || amount === null) return unit === 'coins' ? '0' : '₹0.00';

    if (unit === 'coins') {
        return amount.toLocaleString('en-IN');
    }

    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount);
};

/**
 * Formats a date object or timestamp string into a readable date string.
 * Default format: "DD MMM YYYY, h:mm A" (e.g., "01 Feb 2026, 12:30 PM").
 * 
 * @param {Date|string|number} date - The date to format.
 * @returns {string} Formatted date string or 'N/A' if invalid.
 */
export const formatDate = (date) => {
    if (!date) return 'N/A';

    // Handle Firestore Timestamps
    let d;
    if (typeof date === 'object' && date?.toDate) {
        d = date.toDate();
    } else {
        d = new Date(date);
    }

    if (isNaN(d.getTime())) return 'N/A';

    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    }).format(d);
};

/**
 * Formats file size in bytes to human-readable string (KB, MB).
 * 
 * @param {number} bytes - Size in bytes.
 * @param {number} [decimals=2] - Number of decimal places.
 * @returns {string} Formatted size (e.g., "2.5 MB").
 */
export const formatFileSize = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Truncates a long string and adds an ellipsis.
 * 
 * @param {string} text - The input string.
 * @param {number} maxLength - Maximum length options.
 * @returns {string} Truncated string.
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Calculates time elapsed since a date in a human-readable format.
 * e.g., "5 minutes ago", "2 days ago".
 * 
 * @param {Date|string|number|object} date - The date or Firestore Timestamp to check.
 * @returns {string} Relative time string.
 */
export const timeAgo = (date) => {
    if (!date) return 'Just now';

    // Handle Firestore Timestamps
    let d;
    if (typeof date === 'object' && date?.toDate) {
        d = date.toDate();
    } else {
        d = new Date(date);
    }

    if (isNaN(d.getTime())) return 'Just now';

    const seconds = Math.floor((new Date() - d) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};

/**
 * Formats a date into a simple time string.
 * @param {Date|string|number|object} date 
 * @returns {string} Formatted time (e.g. "12:30 PM")
 */
export const formatTime = (date) => {
    if (!date) return '...';

    // Handle Firestore Timestamps
    let d;
    if (typeof date === 'object' && date?.toDate) {
        d = date.toDate();
    } else {
        d = new Date(date);
    }

    if (isNaN(d.getTime())) return '...';

    return d.toLocaleTimeString('en-IN', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
};
