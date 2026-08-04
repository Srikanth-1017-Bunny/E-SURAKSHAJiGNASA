import { useState } from 'react';
import { uploadToCloudinary } from '../utils/cloudinary';
import { analyzeImage } from '../services/aiService';

export const useAIScan = () => {
    const [status, setStatus] = useState('idle'); // idle, uploading, analyzing, completed, error
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const scanImage = async (file) => {
        try {
            setStatus('uploading');
            setError(null);

            // 1. Upload to Cloudinary
            const imageUrl = await uploadToCloudinary(file);

            if (!imageUrl) {
                throw new Error('Image upload failed');
            }

            // 2. Perform AI Analysis
            setStatus('analyzing');
            const analysis = await analyzeImage(imageUrl);

            if (analysis.success) {
                setResult({
                    ...analysis,
                    imageUrl
                });
                setStatus('completed');
            } else {
                throw new Error('AI Analysis failed');
            }

        } catch (err) {
            console.error('AI Scan Error:', err);
            setError(err.message || 'An unexpected error occurred during scan.');
            setStatus('error');
        }
    };

    const resetScan = () => {
        setStatus('idle');
        setResult(null);
        setError(null);
    };

    return {
        status,
        result,
        error,
        scanImage,
        resetScan
    };
};
