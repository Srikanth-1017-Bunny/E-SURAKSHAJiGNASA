/**
 * Image Utilities
 * Helpers for handling image files in the browser.
 * @module imageHelpers
 */

/**
 * Converts a File object to a Base64 string.
 * Useful for image previews before upload.
 * 
 * @param {File} file - The file to convert.
 * @returns {Promise<string>} Base64 string.
 */
export const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

/**
 * Validates if a file is an image.
 * 
 * @param {File} file - The file to check.
 * @returns {boolean} True if it is an image.
 */
export const isImageFile = (file) => {
    return file && file.type.startsWith('image/');
};

/**
 * Placeholder for client-side image compression.
 * In a real implementation, would use canvas or a library like 'browser-image-compression'.
 * 
 * @param {File} file - Original file.
 * @returns {Promise<File>} Compressed file (currently returns original).
 */
export const compressImage = async (file) => {
    // Determine compression logic here if needed
    console.log("Compressing image...", file.name);
    return file;
};
