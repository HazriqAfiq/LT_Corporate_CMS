import React, { useState } from 'react';
import { ImagePlus, X, File as FileIcon } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';
import InputLabel from '@/Components/InputLabel';

export default function MediaSelectorInput({ 
    label, 
    value, 
    onChange, 
    multiple = false, 
    collection = 'branding',
    error,
    initialMedia = null
}) {
    const [showModal, setShowModal] = useState(false);
    
    // Initialize selectedMedia with initialMedia if provided
    const [selectedMedia, setSelectedMedia] = useState(initialMedia);

    React.useEffect(() => {
        if (value === null || value === undefined || value === '') {
            setSelectedMedia(null);
        } else if (initialMedia) {
            if (multiple) {
                const valueArray = Array.isArray(value) ? value : [value];
                const initialMediaArray = Array.isArray(initialMedia) ? initialMedia : [initialMedia];
                const valueIds = valueArray.map(id => String(id)).sort().join(',');
                const initialIds = initialMediaArray.map(m => String(m.id)).sort().join(',');
                if (valueIds === initialIds) {
                    setSelectedMedia(initialMedia);
                }
            } else {
                if (String(value) === String(initialMedia.id)) {
                    setSelectedMedia(initialMedia);
                }
            }
        } else if (typeof value === 'string' && !/^\d+$/.test(value)) {
            setSelectedMedia({
                id: value,
                url: value.startsWith('http') || value.startsWith('/storage') || value.startsWith('/') ? value : `/storage/${value}`,
                type: 'image',
                is_image: true,
                original_filename: value.split('/').pop()
            });
        }
    }, [value, initialMedia, multiple]);

    const handleSelect = (media) => {
        setSelectedMedia(media);
        if (multiple) {
            onChange(media.map(m => m.id));
        } else {
            onChange(media ? media.id : null);
        }
    };

    const handleRemove = (e, index = -1) => {
        e.stopPropagation();
        if (multiple) {
            const newMedia = [...selectedMedia];
            newMedia.splice(index, 1);
            setSelectedMedia(newMedia);
            onChange(newMedia.map(m => m.id));
        } else {
            setSelectedMedia(null);
            onChange(null);
        }
    };

    const renderPreview = () => {
        if (!selectedMedia || (multiple && selectedMedia.length === 0)) {
            return (
                <div className="media-selector-empty flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 hover:border-gold/50 cursor-pointer transition-colors" onClick={() => setShowModal(true)}>
                    <ImagePlus className="w-8 h-8 text-gray-500 mb-2" />
                    <span className="media-selector-empty-text text-sm text-gray-400">Klik untuk pilih media</span>
                </div>
            );
        }

        if (!multiple) {
            const medium = selectedMedia;
            return (
                <div className="media-selector-preview relative inline-block border border-gray-700 rounded-xl overflow-hidden bg-gray-900 group">
                    {medium.type === 'image' || medium.is_image ? (
                        <img 
                            src={medium.url} 
                            alt="Selected" 
                            className="h-32 w-auto object-cover" 
                            onError={(e) => {
                                e.target.onerror = null;
                                const parent = e.target.parentNode;
                                if (parent) {
                                    // Remove the image and replace it with the fallback layout
                                    e.target.style.display = 'none';
                                    const fallback = document.createElement('div');
                                    fallback.className = 'media-selector-fallback h-32 w-32 flex flex-col items-center justify-center p-4 bg-[#0c0c0e] border border-white/5';
                                    fallback.innerHTML = `
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-8 h-8 text-zinc-600 mb-2 opacity-50"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="10" x2="10" y1="21" y2="21"/><path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/><path d="M21 16V5a2 2 0 0 0-2-2H10"/></svg>
                                        <span class="text-xs text-center text-zinc-500 font-medium break-all line-clamp-2">Fail Tiada</span>
                                    `;
                                    parent.insertBefore(fallback, parent.firstChild);
                                }
                            }}
                        />
                    ) : (
                        <div className="media-selector-non-image h-32 w-32 flex flex-col items-center justify-center p-4 bg-gray-900">
                            <FileIcon className="w-8 h-8 text-gray-400 mb-2" />
                            <span className="text-xs text-center text-gray-500 break-all line-clamp-2">{medium.original_filename}</span>
                        </div>
                    )}
                    <div className="media-selector-overlay absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                        <button type="button" onClick={() => setShowModal(true)} className="media-selector-btn-swap p-2 bg-white/10 rounded-full hover:bg-white/20 text-white" title="Tukar"><ImagePlus className="w-4 h-4" /></button>
                        <button type="button" onClick={handleRemove} className="media-selector-btn-remove p-2 bg-red-600/70 rounded-full hover:bg-red-600 text-white" title="Buang"><X className="w-4 h-4" /></button>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                    {selectedMedia.map((medium, idx) => (
                        <div key={medium.id || idx} className="media-selector-multi-item relative inline-block border border-gray-700 rounded-xl overflow-hidden bg-gray-900 group w-24 h-24">
                            {medium.type === 'image' || medium.is_image ? (
                                <img src={medium.url} alt="Selected" className="w-full h-full object-cover" />
                            ) : (
                                <div className="media-selector-multi-non-image w-full h-full flex flex-col items-center justify-center p-2 bg-gray-900">
                                    <FileIcon className="w-6 h-6 text-gray-400 mb-1" />
                                    <span className="text-[9px] text-center text-gray-500 break-all line-clamp-2">{medium.original_filename}</span>
                                </div>
                            )}
                            <button type="button" onClick={(e) => handleRemove(e, idx)} className="media-selector-btn-remove-multi absolute top-1 right-1 p-1 bg-red-600/70 rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-opacity">
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                    <div className="media-selector-btn-add-multi flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-700 bg-gray-900/50 rounded-xl hover:bg-gray-800/50 hover:border-gold/50 cursor-pointer transition-colors" onClick={() => setShowModal(true)}>
                        <ImagePlus className="w-6 h-6 text-gray-500 mb-1" />
                        <span className="text-[10px] text-gray-400">Tambah</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full">
            {label && <InputLabel value={label} className="mb-2" />}
            
            {renderPreview()}

            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

            <MediaPickerModal
                show={showModal}
                onClose={() => setShowModal(false)}
                onSelect={handleSelect}
                multiple={multiple}
                collection={collection}
                initialSelectedIds={value ? (Array.isArray(value) ? value : [value]) : []}
            />
        </div>
    );
}
