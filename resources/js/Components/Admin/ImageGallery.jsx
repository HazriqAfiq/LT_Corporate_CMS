import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Star, GripVertical, Plus } from 'lucide-react';

/**
 * Sortable image gallery component for Products and Portfolio.
 *
 * Props:
 *   existingImages — string[]  (paths already saved e.g. 'products/gallery/abc.jpg')
 *   newFiles       — File[]    (newly selected but not yet uploaded)
 *   onAddFiles     — (File[]) => void
 *   onRemoveExisting — (path: string) => void
 *   onRemoveNew    — (index: number) => void
 *   featuredImage  — string | null  (path of the featured image)
 *   onSetFeatured  — (path: string) => void
 *   maxImages      — number (default 10)
 *   label          — string
 */
export default function ImageGallery({
    existingImages = [],
    newFiles = [],
    onAddFiles,
    onRemoveExisting,
    onRemoveNew,
    featuredImage,
    onSetFeatured,
    maxImages = 10,
    label = 'Galeri Imej',
}) {
    const totalCount = existingImages.length + newFiles.length;
    const canAddMore = totalCount < maxImages;

    const onDrop = useCallback((acceptedFiles) => {
        const remaining = maxImages - totalCount;
        onAddFiles(acceptedFiles.slice(0, remaining));
    }, [onAddFiles, totalCount, maxImages]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
        maxSize: 5 * 1024 * 1024,
        multiple: true,
        disabled: !canAddMore,
    });

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-zinc-300">
                    {label}
                    <span className="ml-2 text-[11px] font-normal text-zinc-500">
                        ({totalCount}/{maxImages} imej)
                    </span>
                </label>
            </div>

            {/* Gallery grid */}
            {(existingImages.length > 0 || newFiles.length > 0) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {/* Existing saved images */}
                    {existingImages.map((path, idx) => {
                        const url = `/storage/${path}`;
                        const isFeatured = featuredImage === path;
                        return (
                            <div key={`existing-${idx}`} className="group relative rounded-xl overflow-hidden border border-white/10 bg-[#0a0a0c] aspect-square">
                                <img src={url} alt="" className="w-full h-full object-cover" />

                                {/* Featured badge */}
                                {isFeatured && (
                                    <div className="absolute top-2 left-2 bg-[var(--gold)] text-[#080808] text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <Star className="w-2.5 h-2.5" /> Utama
                                    </div>
                                )}

                                {/* Hover controls */}
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                    {onSetFeatured && !isFeatured && (
                                        <button
                                            type="button"
                                            onClick={() => onSetFeatured(path)}
                                            className="px-3 py-1.5 rounded-lg bg-[var(--gold)] text-[#080808] text-[10px] font-bold flex items-center gap-1 hover:opacity-90"
                                        >
                                            <Star className="w-3 h-3" /> Tetapkan Utama
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => onRemoveExisting(path)}
                                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-red-700"
                                    >
                                        <X className="w-3 h-3" /> Buang
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Newly selected files (not yet uploaded) */}
                    {newFiles.map((file, idx) => {
                        const url = URL.createObjectURL(file);
                        return (
                            <div key={`new-${idx}`} className="group relative rounded-xl overflow-hidden border border-[var(--gold)]/30 bg-[#0a0a0c] aspect-square">
                                <img src={url} alt={file.name} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-[var(--gold)]/90 text-[#080808] text-[9px] font-bold px-2 py-0.5 rounded-full">
                                    Baru
                                </div>
                                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button
                                        type="button"
                                        onClick={() => onRemoveNew(idx)}
                                        className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-[10px] font-bold flex items-center gap-1 hover:bg-red-700"
                                    >
                                        <X className="w-3 h-3" /> Buang
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    {/* Add more button (only if within limit) */}
                    {canAddMore && (
                        <div
                            {...getRootProps()}
                            className={`rounded-xl border-2 border-dashed aspect-square flex flex-col items-center justify-center cursor-pointer transition-all ${
                                isDragActive
                                    ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                                    : 'border-white/10 hover:border-[var(--gold)]/40 hover:bg-white/[0.02]'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <Plus className={`w-8 h-8 mb-1 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-600'}`} />
                            <span className="text-[10px] text-zinc-600">Tambah</span>
                        </div>
                    )}
                </div>
            )}

            {/* Empty state — full drop zone */}
            {existingImages.length === 0 && newFiles.length === 0 && (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                        isDragActive
                            ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                            : 'border-white/10 hover:border-[var(--gold)]/40 hover:bg-white/[0.02]'
                    }`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud className={`w-10 h-10 mb-3 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-600'}`} />
                    <p className="text-sm font-medium text-zinc-400 text-center">Tarik & lepas imej galeri di sini</p>
                    <p className="text-xs text-zinc-600 mt-1">Maks {maxImages} imej, 5 MB setiap satu</p>
                </div>
            )}
        </div>
    );
}
