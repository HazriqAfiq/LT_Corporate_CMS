import React from 'react';
import { Check, File, FileText, Film, Music, Hash } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function MediaGrid({ media, selectedIds = [], onSelect, multiSelect = false, usageData = {} }) {
    const { t } = useTranslation();

    const handleSelect = (medium) => {
        if (multiSelect) {
            const isSelected = selectedIds.includes(medium.id) || (medium.path && selectedIds.includes(medium.path));
            if (isSelected) {
                onSelect(selectedIds.filter(id => id != medium.id && id != medium.path));
            } else {
                onSelect([...selectedIds, medium.id]);
            }
        } else {
            const isSelected = selectedIds.includes(medium.id) || (medium.path && selectedIds.includes(medium.path));
            if (isSelected) {
                onSelect([]);
            } else {
                onSelect([medium.id]);
            }
        }
    };

    const renderThumbnail = (medium) => {
        if (medium.type === 'image' || medium.is_image) {
            return (
                <img 
                    src={medium.thumbnail_url || medium.url} 
                    alt={medium.title || medium.original_filename} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.onerror = null;
                        const parent = e.target.parentNode;
                        if (parent) {
                            parent.innerHTML = `
                                <div class="flex flex-col items-center justify-center text-zinc-500 p-2 text-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 mb-1 text-zinc-600 opacity-60"><line x1="2" x2="22" y1="2" y2="22"/><path d="M10.41 10.41a2 2 0 1 1-2.83-2.83"/><line x1="10" x2="10" y1="21" y2="21"/><path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3"/><path d="M21 16V5a2 2 0 0 0-2-2H10"/></svg>
                                    <span class="text-[9px] text-zinc-500 font-medium">${t('file_missing')}</span>
                                </div>
                            `;
                        }
                    }}
                />
            );
        }
        if (medium.type === 'video') return <Film className="w-12 h-12 text-gray-400" />;
        if (medium.type === 'audio') return <Music className="w-12 h-12 text-gray-400" />;
        if (medium.mime_type === 'application/pdf') return <FileText className="w-12 h-12 text-gray-400" />;
        return <File className="w-12 h-12 text-gray-400" />;
    };

    if (!media || media.length === 0) {
        return (
            <div className="media-grid-empty flex flex-col items-center justify-center p-16 text-zinc-500 bg-[#0c0c0e]/30 rounded-2xl border border-white/5 border-dashed">
                <File className="w-12 h-12 mb-4 opacity-30 text-zinc-400" />
                <p className="text-sm font-medium tracking-wide">{t('no_media_found')}</p>
                <p className="text-xs text-zinc-600 mt-1">{t('upload_new_tab')}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {media.map((medium) => {
                const isSelected = selectedIds.includes(medium.id) || (medium.path && selectedIds.includes(medium.path));
                const selectIndex = selectedIds.findIndex(id => id == medium.id || id == medium.path);
                const ud = usageData[medium.id];
                const usageCount = ud?.count || 0;
                
                return (
                    <div 
                        key={medium.id}
                        onClick={() => handleSelect(medium)}
                        className={`media-card relative aspect-square rounded-xl border overflow-hidden cursor-pointer group transition-all duration-300
                            ${isSelected 
                                ? 'border-[var(--gold)] shadow-[0_0_15px_rgba(234,179,8,0.25)] scale-[0.98]' 
                                : 'border-white/5 hover:border-white/20 bg-[#0c0c0e] hover:scale-[1.02]'
                            }
                        `}
                    >
                        <div className="media-card-thumbnail-wrapper w-full h-full flex items-center justify-center bg-[#08080a]/40">
                            {renderThumbnail(medium)}
                        </div>


                        
                        <div className={`media-card-overlay absolute inset-0 bg-black/60 transition-opacity duration-300 flex flex-col justify-between p-3 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <div className="flex justify-between w-full">
                                <div />
                                {isSelected ? (
                                    <div className="bg-[var(--gold)] text-[#040914] w-5 h-5 rounded-full shadow-md flex items-center justify-center text-[10px] font-extrabold">
                                        {multiSelect ? selectIndex + 1 : <Check className="w-3 h-3 stroke-[3px]" />}
                                    </div>
                                ) : (
                                    <div className="w-5 h-5 rounded-full border border-white/30 bg-black/35 backdrop-blur-sm group-hover:border-white/60 transition-colors" />
                                )}
                            </div>
                            <div className="w-full translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
                                <p className="media-card-filename text-[11px] font-semibold text-white truncate drop-shadow-md">{medium.original_filename}</p>
                                <div className="flex items-center justify-between mt-0.5">
                                    <p className="media-card-size text-[9px] text-zinc-400 drop-shadow-md">{medium.human_size}</p>
                                    {usageCount > 0 && (
                                        <span className="text-[9px] text-[var(--gold)] font-semibold drop-shadow-md">{t('uses_count', { count: usageCount })}</span>
                                    )}
                                </div>
                                {ud?.summary && (
                                    <p className="text-[7px] text-zinc-400 mt-0.5 truncate drop-shadow-md leading-tight">{ud.summary}</p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
