import React, { useState, useEffect } from 'react';
import { ImagePlus, X, Star } from 'lucide-react';
import MediaPickerModal from './MediaPickerModal';
import InputLabel from '@/Components/InputLabel';
import useTranslation from '@/Hooks/useTranslation';

export default function UnifiedImageManager({
    label,
    description,
    value = [],
    featuredId = null,
    onChange,
    onFeaturedChange,
    collection = 'branding',
    error,
    initialMedia = []
}) {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [mediaItems, setMediaItems] = useState(initialMedia || []);

    const initialMediaIdsString = (initialMedia || []).map(m => m.id).join(',');
    useEffect(() => {
        if (initialMedia && initialMedia.length > 0) {
            setMediaItems(initialMedia);
        }
    }, [initialMediaIdsString]);

    const mediaIdsString = mediaItems.map(m => m.id).join(',');
    useEffect(() => {
        const hasFeatured = mediaItems.some(m => m.id == featuredId);
        if ((!featuredId || !hasFeatured) && mediaItems.length > 0) {
            onFeaturedChange(mediaItems[0].id);
        }
    }, [featuredId, mediaIdsString, onFeaturedChange]);

    const handleSelect = (selectedItems) => {
        const merged = [...mediaItems];
        const existingIds = new Set(merged.map(m => m.id));
        const newItems = Array.isArray(selectedItems) ? selectedItems : [selectedItems];
        newItems.forEach(item => {
            if (!existingIds.has(item.id)) {
                merged.push(item);
            }
        });
        setMediaItems(merged);
        const ids = merged.map(m => m.id);
        onChange(ids);
        
        const hasFeatured = merged.some(m => m.id == featuredId);
        if ((!featuredId || !hasFeatured) && ids.length > 0) {
            onFeaturedChange(ids[0]);
        }
    };

    const handleRemove = (e, index) => {
        e.stopPropagation();
        const newMedia = [...mediaItems];
        const removedId = newMedia[index].id;
        newMedia.splice(index, 1);
        setMediaItems(newMedia);
        const ids = newMedia.map(m => m.id);
        onChange(ids);
        if (removedId == featuredId) {
            onFeaturedChange(ids.length > 0 ? ids[0] : null);
        }
    };

    const handleSetFeatured = (e, id) => {
        e.stopPropagation();
        onFeaturedChange(id);
    };

    return (
        <div>
            <InputLabel>{label}</InputLabel>
            {description && <p className="text-xs text-zinc-500 mb-3">{description}</p>}

            {mediaItems.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    {mediaItems.map((media, idx) => (
                        <div key={media.id || idx} className="relative group rounded-xl overflow-hidden border border-white/10 bg-[#080808] aspect-[16/10]">
                            <img src={media.url} alt={media.alt_text || media.filename} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={(e) => handleSetFeatured(e, media.id)}
                                    className={`p-1.5 rounded-full text-[10px] font-bold transition-colors ${
                                        media.id == featuredId
                                            ? 'bg-[var(--gold)] text-[#080808]'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                    }`}
                                    style={media.id == featuredId ? {} : { color: '#ffffff' }}
                                    title={media.id == featuredId ? t('featured_image') : t('set_as_featured')}
                                >
                                    <Star className="w-3 h-3" fill={media.id == featuredId ? 'currentColor' : 'none'} style={media.id == featuredId ? {} : { color: '#ffffff', stroke: '#ffffff' }} />
                                </button>
                                <button
                                    type="button"
                                    onClick={(e) => handleRemove(e, idx)}
                                    className="p-1.5 rounded-full bg-red-600/70 text-white hover:bg-red-600 transition-colors flex items-center justify-center"
                                    style={{ color: '#ffffff' }}
                                    title={t('remove_image')}
                                >
                                    <X className="w-3 h-3" style={{ color: '#ffffff', stroke: '#ffffff' }} />
                                </button>
                            </div>
                            {media.id == featuredId && (
                                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-[var(--gold)] text-[#080808] shadow-lg">
                                    {t('featured_badge')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-white/10 bg-[#080808] text-zinc-400 hover:text-white hover:border-[var(--gold)]/30 hover:bg-white/[0.02] transition-all text-sm font-medium"
            >
                <ImagePlus className="w-4 h-4" />
                {mediaItems.length > 0 ? t('add_image') : t('select_image')}
            </button>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

            <MediaPickerModal
                show={showModal}
                onClose={() => setShowModal(false)}
                multiple={true}
                onSelect={handleSelect}
                collection={collection}
                initialSelectedIds={value}
            />
        </div>
    );
}
