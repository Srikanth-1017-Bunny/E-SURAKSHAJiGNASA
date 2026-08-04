import { Timestamp } from "firebase/firestore";

/**
 * Firestore Helpers
 * Utilities for interacting with Firebase Firestore data.
 * @module firestoreHelpers
 */

/**
 * Generates a random alphanumeric ID.
 * Useful for mocking or client-side ID generation before proper Firestore insertion.
 * 
 * @param {number} [length=20] - ID length.
 * @returns {string} Random ID.
 */
export const generateId = (length = 20) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Converts a Firestore Timestamp to a standard JS Date object.
 * Returns null if invalid.
 * 
 * @param {Timestamp|Object} timestamp - The Firestore timestamp object.
 * @returns {Date|null} JS Date object.
 */
export const timestampToDate = (timestamp) => {
    if (!timestamp) return null;

    // Check if it's a Firestore Timestamp(seconds, nanoseconds)
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }

    // Handle serialized object { seconds: ..., nanoseconds: ... }
    if (timestamp.seconds !== undefined) {
        return new Date(timestamp.seconds * 1000);
    }

    return new Date(timestamp);
};

/**
 * Standardizes a doc snapshot into a JS object.
 * Handles ID inclusion and timestamp conversion.
 * 
 * @param {Object} doc - The Firestore document snapshot.
 * @returns {Object} Serialized data.
 */
export const serializeDoc = (doc) => {
    if (!doc.exists()) return null;
    const data = doc.data();

    // Convert all Timestamps to dates for easier UI consumption
    Object.keys(data).forEach(key => {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate();
        }
    });

    return {
        id: doc.id,
        ...data
    };
};
