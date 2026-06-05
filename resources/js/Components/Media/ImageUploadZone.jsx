import React, { useCallback, useState } from 'react';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import useTranslation from '@/Hooks/useTranslation';

export default function ImageUploadZone({ collection = 'branding', onUploadSuccess, multiple = false }) {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const uploadFiles = async (files) => {
        if (!files || files.length === 0) return;

        setError(null);
        setIsUploading(true);
        setProgress(0);

        const formData = new FormData();
        Array.from(files).forEach(file => {
            formData.append('files[]', file);
        });
        formData.append('collection', collection);

        try {
            const response = await axios.post(route('admin.media.store'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Accept': 'application/json',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentCompleted);
                }
            });

            if (response.data.success) {
                if (onUploadSuccess) {
                    onUploadSuccess(response.data.media);
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Ralat berlaku semasa muat naik fail.');
            console.error(err);
        } finally {
            setIsUploading(false);
            setProgress(0);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const files = multiple ? e.dataTransfer.files : [e.dataTransfer.files[0]];
            uploadFiles(files);
        }
    }, [multiple, collection]);

    const handleFileInput = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const files = multiple ? e.target.files : [e.target.files[0]];
            uploadFiles(files);
            // Reset input so the same file can be selected again
            e.target.value = '';
        }
    };

    return (
        <div className="w-full">
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`upload-zone
                    relative border border-dashed rounded-2xl p-10 flex flex-col items-center justify-center
                    transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
                    ${isDragging 
                        ? 'border-[var(--gold)] bg-[var(--gold)]/5 shadow-[0_0_20px_rgba(234,179,8,0.15)] scale-[1.01]' 
                        : 'border-white/10 bg-[#0c0c0e]/60 hover:border-[var(--gold)]/40 hover:bg-[#0c0c0e]/90 hover:shadow-[0_4px_20px_rgba(0,0,0,0.4)]'
                    }
                    ${isUploading ? 'opacity-65 pointer-events-none' : ''}
                `}
            >
                {/* Main Content View */}
                {isUploading ? (
                    <div className="flex flex-col items-center text-[var(--gold)] py-4 relative z-0">
                        <Loader2 className="w-12 h-12 mb-4 animate-spin text-[var(--gold)]" />
                        <p className="upload-title text-lg font-semibold tracking-wide mb-2 text-white">{t('uploading_files')}</p>
                        <p className="upload-desc text-sm text-zinc-400 mb-4">{progress}% {t('completed')}</p>
                        <div className="w-56 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[var(--gold)] transition-all duration-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center text-center py-4 relative z-0 pointer-events-none">
                        <div className={`upload-icon-wrapper p-4 rounded-2xl mb-5 transition-transform duration-300 ${isDragging ? 'bg-[var(--gold)]/20 text-[var(--gold)] scale-110' : 'bg-white/5 text-zinc-400 group-hover:scale-105'}`}>
                            <UploadCloud className="w-10 h-10" />
                        </div>
                        <p className="upload-title text-lg font-bold text-white mb-2 tracking-wide">
                            {isDragging ? t('drop_files') : t('click_or_drag')}
                        </p>
                        <p className="upload-desc text-sm text-zinc-500 max-w-sm leading-relaxed mb-1">
                            {t('supported_formats_label')}<strong className="text-zinc-400">{t('supported_formats_val')}</strong>
                        </p>
                        <p className="upload-desc text-xs text-zinc-600">
                            {t('max_file_size_label')}
                        </p>
                    </div>
                )}

                {/* File input placed at the very end with higher z-index to overlay click events */}
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    onChange={handleFileInput}
                    multiple={multiple}
                    disabled={isUploading}
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,application/pdf,video/mp4,video/webm"
                />
            </div>
            
            {error && (
                <div className="upload-error mt-5 p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex items-start text-red-400 animate-fade-up">
                    <X className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-sm">Ralat Muat Naik</p>
                        <p className="text-xs mt-1 text-red-400/80 leading-relaxed">{error}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
