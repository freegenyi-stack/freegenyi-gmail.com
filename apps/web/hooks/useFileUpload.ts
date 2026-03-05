'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface UseFileUploadOptions {
    maxSize?: number;
    acceptedTypes?: string[];
    onSuccess?: (url: string) => void;
    onError?: (error: string) => void;
}

export function useFileUpload(options: UseFileUploadOptions = {}) {
    const {
        maxSize = 10 * 1024 * 1024, // 10MB
        acceptedTypes = ['image/*', 'application/pdf', 'video/*'],
        onSuccess,
        onError
    } = options;

    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const uploadFile = useCallback(async (file: File) => {
        setUploading(true);
        setProgress(0);

        try {
            // Get presigned URL
            const presignResponse = await fetch('/api/upload/presign', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            });

            if (!presignResponse.ok) {
                throw new Error('Erreur lors de la génération de l\'URL de téléchargement');
            }

            const { url, key } = await presignResponse.json();

            // Upload to S3
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    setProgress(percentComplete);
                }
            });

            await new Promise((resolve, reject) => {
                xhr.addEventListener('load', () => {
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error('Erreur lors du téléchargement'));
                    }
                });
                xhr.addEventListener('error', () => reject(new Error('Erreur réseau')));

                xhr.open('PUT', url);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });

            const fileUrl = `${process.env.NEXT_PUBLIC_CDN_URL || ''}/${key}`;
            setUploadedUrl(fileUrl);
            onSuccess?.(fileUrl);

            return fileUrl;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erreur inconnue';
            onError?.(message);
            throw error;
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [onSuccess, onError]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                await uploadFile(acceptedFiles[0]);
            }
        },
        maxSize,
        accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
        multiple: false
    });

    return {
        uploading,
        progress,
        uploadedUrl,
        uploadFile,
        getRootProps,
        getInputProps,
        isDragActive
    };
}
