import React, { useState } from 'react';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { FaCloudUploadAlt, FaSpinner, FaCheck, FaArrowUp } from 'react-icons/fa';

const ImageUploader = ({ onUpload, label = "Upload Image", sublabel = "Select an image file", className = "" }) => {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show local preview immediately
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        setUploading(true);

        try {
            const url = await uploadToCloudinary(file);
            onUpload(url);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image");
            setPreview(null); // Reset on failure
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`w-full ${className}`}>
            <div className="flex flex-col items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full min-h-[160px] border-2 border-dashed border-slate-300 rounded-3xl cursor-pointer hover:bg-slate-100 hover:border-emerald-400 transition-all group">
                    {preview ? (
                        <div className="relative w-full h-full p-4 flex flex-col items-center">
                            <img src={preview} alt="Preview" className="max-h-48 w-full object-contain rounded-2xl shadow-sm" />
                            {uploading && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-3xl">
                                    <div className="flex flex-col items-center gap-2">
                                        <FaSpinner className="animate-spin text-emerald-600 text-3xl" />
                                        <span className="text-emerald-700 font-bold">Uploading...</span>
                                    </div>
                                </div>
                            )}
                            {!uploading && (
                                <div className="mt-3 flex items-center gap-2 text-emerald-600 font-bold">
                                    <FaCheck /> <span>Upload Successful</span>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-all">
                                <FaCloudUploadAlt className="text-3xl" />
                            </div>
                            <p className="text-lg font-bold text-slate-600 mb-1">{label}</p>
                            <p className="text-sm text-slate-400 font-medium px-4 text-center">{sublabel}</p>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
                </label>
            </div>
        </div>
    );
};

export default ImageUploader;

