/**
 * Conversion Utilities
 * Handles logic for converting between currency and reward points (coins).
 * @module conversion
 */

/**
 * Converts Rupees to Coins based on the application's reward logic.
 * Logic: 1 Rupee = 2 Coins.
 * 
 * @param {number} amount - The amount in Rupees.
 * @returns {number} The equivalent value in Coins.
 */
export const rupeesToCoins = (amount) => {
    if (!amount || amount < 0) return 0;
    return Math.floor(amount * 2);
};

/**
 * Converts Coins to Rupees.
 * Logic: 2 Coins = 1 Rupee.
 * 
 * @param {number} coins - The number of coins.
 * @returns {number} The equivalent value in Rupees.
 */
export const coinsToRupees = (coins) => {
    if (!coins || coins < 0) return 0;
    return coins / 2;
};

/**
 * Calculates the commission for a collector.
 * Example: 10% of the total value.
 * 
 * @param {number} amount - The total transaction amount.
 * @param {number} [percentage=10] - Commission percentage (default 10%).
 * @returns {number} The calculated commission.
 */
export const calculateCommission = (amount, percentage = 10) => {
    if (!amount || amount < 0) return 0;
    return (amount * percentage) / 100;
};
