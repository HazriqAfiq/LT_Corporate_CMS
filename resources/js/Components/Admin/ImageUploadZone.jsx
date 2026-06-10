import React, { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Image as ImageIcon, AlertCircle } from 'lucide-react';

/**
 * Reusable image upload zone with drag-and-drop, preview, and remove.
 *
 * Props:
 *   label            — string
 *   value            — File object (new) or string URL (existing)
 *   onChange         — (File|null) => void
 *   recommendedSize  — string e.g. "1920×1080"
 *   maxSizeMB        — number (default 5)
 *   accept           — dropzone accept object (default images only)
 *   error            — string error message
 *   className        — extra wrapper class
 */
export default function ImageUploadZone({
    label,
    value,
    onChange,
    recommendedSize,
    maxSizeMB = 5,
    accept = { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'] },
    error,
    className = '',
}) {
    const inputRef = useRef(null);

    const onDrop = useCallback((acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            onChange(acceptedFiles[0]);
        }
    }, [onChange]);

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept,
        maxSize: maxSizeMB * 1024 * 1024,
        multiple: false,
    });

    // Determine preview URL
    const previewUrl = value
        ? (typeof value === 'string' ? value : URL.createObjectURL(value))
        : null;

    const fileName = value
        ? (typeof value === 'string' ? value.split('/').pop() : value.name)
        : null;

    const fileSizeText = value && typeof value !== 'string'
        ? `${(value.size / 1024 / 1024).toFixed(2)} MB`
        : null;

    const rejectionMsg = fileRejections[0]?.errors?.[0]?.message;

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-semibold text-zinc-300">
                    {label}
                    {recommendedSize && (
                        <span className="ml-2 text-[11px] font-normal text-zinc-500">
                            (Saiz disyorkan: {recommendedSize})
                        </span>
                    )}
                </label>
            )}

            {!previewUrl ? (
                <div
                    {...getRootProps()}
                    className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 ${
                        isDragActive
                            ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                            : 'border-white/10 hover:border-[var(--gold)]/50 hover:bg-white/[0.02]'
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="w-14 h-14 rounded-2xl bg-[var(--gold)]/10 flex items-center justify-center mb-4">
                        <UploadCloud className={`w-7 h-7 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-500'}`} />
                    </div>
                    <p className="text-sm font-medium text-zinc-300 text-center">
                        {isDragActive ? 'Lepaskan imej di sini...' : 'Tarik & lepas atau klik untuk muat naik'}
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                        {Object.values(accept).flat().join(', ').toUpperCase()} — Maks {maxSizeMB} MB
                    </p>
                </div>
            ) : (
                <div className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0c]">
                    {/* Preview image */}
                    <img
                        src={previewUrl}
                        alt={fileName}
                        className="w-full max-h-56 object-cover"
                    />

                    {/* Overlay controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => inputRef.current?.click()}
                            className="px-4 py-2 rounded-full bg-[var(--gold)] text-[#080808] text-xs font-bold hover:opacity-90 transition"
                        >
                            Ganti Imej
                        </button>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="px-4 py-2 rounded-full bg-red-600/70 text-white text-xs font-bold hover:bg-red-600 transition"
                        >
                            Buang
                        </button>
                    </div>

                    {/* Hidden real input for replace */}
                    <input
                        ref={inputRef}
                        type="file"
                        className="hidden"
                        accept={Object.keys(accept).join(',')}
                        onChange={(e) => {
                            if (e.target.files?.[0]) onChange(e.target.files[0]);
                        }}
                    />

                    {/* File info bar */}
                    <div className="px-4 py-3 flex items-center gap-3 border-t border-white/5">
                        <ImageIcon className="w-4 h-4 text-[var(--gold)] flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-white truncate">{fileName}</p>
                            {fileSizeText && <p className="text-[10px] text-zinc-500">{fileSizeText}</p>}
                        </div>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="flex-shrink-0 p-1 rounded-full hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Error messages */}
            {(error || rejectionMsg) && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error || rejectionMsg}</span>
                </div>
            )}
        </div>
    );
}
