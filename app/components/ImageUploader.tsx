'use client'
import React, { useState, useRef, useLayoutEffect } from 'react';
import TeX from '@matejmazur/react-katex';
import 'katex/dist/katex.min.css';
import styles from './ImageUploader.module.css';
import { FaSpinner, FaCheck } from 'react-icons/fa';

const ImageUploader = () => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [latex, setLatex] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type.startsWith('image')) {
            setImagePreview(URL.createObjectURL(file));
            setImageFile(file);  // Keep the file reference
            setIsLoading(false);
            setIsSuccess(false);
        } else {
            setImagePreview(null);
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const items = e.clipboardData.items;
        for (const item of items) {
            if (item.type.startsWith('image')) {
                const blob = item.getAsFile();
                if (blob) {
                    const src = URL.createObjectURL(blob);
                    setImagePreview(src);
                    setImageFile(blob); // Update the imageFile state
                    setIsLoading(false);
                    setIsSuccess(false);
                }
            }
        }
    };

    const sendImageToBackend = async () => {
        if (!imageFile) return; // Do nothing if no image

        setIsLoading(true);
        const formData = new FormData();
        formData.append('image', imageFile);

        try {
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setLatex(data.choices[0].message.content);
            setIsSuccess(true);
        } catch (error) {
            console.error('Error uploading image:', error);
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    };

    useLayoutEffect(() => {
    }, [latex]);

    return (
        <div onPaste={handlePaste}>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <div className='tw-flex tw-justify-between'>
                <button className='btn btn-secondary tw-my-2' onClick={() => fileInputRef.current && fileInputRef.current.click()}>Upload Image</button>
                <div className='tw-flex tw-items-center'>
                    {isLoading && <FaSpinner className={styles.iconLoading} />}
                    {!isLoading && isSuccess && <FaCheck className={styles.iconSuccess} />}
                    <button className='btn btn-primary tw-my-2 tw-ml-2' onClick={sendImageToBackend} disabled={!imagePreview || isLoading}>OCR</button>
                </div>
            </div>
            <div>
                {imagePreview && <img src={imagePreview} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '400px' }} />}
            </div>
            <textarea className='form-control tw-my-2' value={latex} onChange={(e) => setLatex(e.target.value)} style={{ width: '100%', height: '100px' }}></textarea>
            <div>
                <TeX className='form-control tw-my-2' math={latex} />
            </div>
        </div>
    );
};

export default ImageUploader;
