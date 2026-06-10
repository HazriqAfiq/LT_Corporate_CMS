import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import { X, Search, Hash } from 'lucide-react';
import axios from 'axios';
import MediaGrid from './MediaGrid';
import ImageUploadZone from './ImageUploadZone';
import TextInput from '@/Components/TextInput';
import useTranslation from '@/Hooks/useTranslation';


export default function MediaPickerModal({ 
    show, onClose, onSelect, multiple = false, 
    collection = 'branding', title
}) {
    const { t } = useTranslation();
    const displayTitle = title || t('choose_media');
    const [activeTab, setActiveTab] = useState('library');
    const [mediaList, setMediaList] = useState([]);

    const USAGE_GROUPS = [
        { label: t('usage_group_general'), options: [
            { value: '', label: t('filter_all_images') },
            { value: 'unused', label: t('filter_unused_images') },
        ]},
        { label: t('usage_group_branding'), options: [{ value: 'branding', label: t('filter_branding') }]},
        { label: t('usage_group_articles'), options: [
            { value: 'article_gallery', label: t('filter_article_gallery') },
            { value: 'article_content', label: t('filter_article_content') },
        ]},
        { label: t('usage_group_products'), options: [
            { value: 'product_icon', label: t('filter_product_icon') },
            { value: 'product_gallery', label: t('filter_product_gallery') },
            { value: 'product_content', label: t('filter_product_content') },
        ]},
        { label: t('usage_group_projects'), options: [
            { value: 'project_gallery', label: t('filter_project_gallery') },
            { value: 'project_content', label: t('filter_project_content') },
        ]},
        { label: t('usage_group_services'), options: [
            { value: 'service_image', label: t('filter_service_image') },
        ]},
        { label: t('usage_group_other'), options: [
            { value: 'slider', label: t('filter_slider') },
            { value: 'team', label: t('filter_team') },
            { value: 'seo', label: t('filter_seo') },
        ]},
    ];

    const SORT_OPTIONS = [
        { value: 'created_at-desc', label: t('sort_newest') },
        { value: 'created_at-asc', label: t('sort_oldest') },
        { value: 'filename-asc', label: t('sort_name_az') },
        { value: 'filename-desc', label: t('sort_name_za') },
        { value: 'size-desc', label: t('sort_largest') },
        { value: 'size-asc', label: t('sort_smallest') },
    ];
    const [usageData, setUsageData] = useState({});
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);
    const [usageFilter, setUsageFilter] = useState('');
    const [sortValue, setSortValue] = useState('created_at-desc');

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const [sortBy, sortDir] = sortValue.split('-');
            const response = await axios.get(route('admin.media.index'), {
                params: {
                    search: search || undefined,
                    usage: usageFilter || undefined,
                    sort_by: sortBy,
                    sort_dir: sortDir,
                },
                headers: { 'Accept': 'application/json' }
            });
            if (response.data && response.data.media) {
                setMediaList(response.data.media.data || response.data.media);
                setUsageData(response.data.usageData || {});
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
        } finally {
            setLoading(false);
        }
    }, [search, usageFilter, sortValue]);

    useEffect(() => {
        if (show && activeTab === 'library') {
            fetchMedia();
        }
    }, [show, activeTab, fetchMedia]);

    useEffect(() => {
        if (!show) {
            setSelectedIds([]);
            setSearch('');
            setUsageFilter('');
            setSortValue('created_at-desc');
            setActiveTab('library');
        }
    }, [show]);

    const handleUploadSuccess = (newMedia) => {
        setMediaList([...newMedia, ...mediaList]);
        setActiveTab('library');
        if (newMedia.length > 0) {
            if (multiple) {
                setSelectedIds([...selectedIds, ...newMedia.map(m => m.id)]);
            } else {
                setSelectedIds([newMedia[0].id]);
            }
        }
    };

    const handleConfirm = () => {
        const selectedMedia = mediaList.filter(m => selectedIds.includes(m.id));
        onSelect(multiple ? selectedMedia : selectedMedia[0]);
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="media-picker-modal bg-[#0c0c0e] text-zinc-100 flex flex-col h-[82vh] rounded-2xl overflow-hidden border border-white/5">
                <div className="media-picker-header px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#08080a]">
                    <h2 className="media-picker-title text-lg font-bold text-white tracking-wide">{displayTitle}</h2>
                    <button onClick={onClose} className="media-picker-close-btn text-zinc-500 hover:text-white transition-colors duration-200 p-1.5 hover:bg-white/5 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="media-picker-tabs flex border-b border-white/5 px-6 bg-[#08080a]">
                    <button className={`media-picker-tab-btn py-4 px-5 font-semibold text-sm border-b-2 transition-all duration-300 ${activeTab === 'library' ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`} onClick={() => setActiveTab('library')}>
                        {t('media_gallery')}
                    </button>
                    <button className={`media-picker-tab-btn py-4 px-5 font-semibold text-sm border-b-2 transition-all duration-300 ${activeTab === 'upload' ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`} onClick={() => setActiveTab('upload')}>
                        {t('upload_new')}
                    </button>
                </div>

                <div className="media-picker-content flex-1 overflow-y-auto p-6 bg-[#060608]">
                    {activeTab === 'library' ? (
                        <div className="space-y-4 h-full flex flex-col">
                            <div className="flex items-center gap-3">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Search className="w-4 h-4 text-zinc-500" />
                                    </div>
                                    <TextInput type="text" placeholder={t('search_media_placeholder')} value={search} onChange={(e) => setSearch(e.target.value)} className="media-picker-search-input pl-10 w-full bg-[#0d0d10] border-white/5 text-white placeholder-zinc-600 focus:border-[var(--gold)]/50 focus:ring-[var(--gold)]/30 rounded-xl" />
                                </div>
                                <select value={usageFilter} onChange={(e) => setUsageFilter(e.target.value)} className="py-2 pl-3 pr-8 border border-white/10 bg-[#0d0d10] text-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--gold)]">
                                    {USAGE_GROUPS.map(group => (
                                        <optgroup key={group.label} label={group.label}>
                                            {group.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                        </optgroup>
                                    ))}
                                </select>
                                <select value={sortValue} onChange={(e) => setSortValue(e.target.value)} className="py-2 pl-3 pr-8 border border-white/10 bg-[#0d0d10] text-zinc-300 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[var(--gold)]">
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <MediaGrid media={mediaList} selectedIds={selectedIds} onSelect={setSelectedIds} multiSelect={multiple} usageData={usageData} />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-full max-w-2xl">
                                <ImageUploadZone collection={collection} multiple={multiple} onUploadSuccess={handleUploadSuccess} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="media-picker-footer px-6 py-5 border-t border-white/5 bg-[#08080a] flex justify-between items-center">
                    <div className="media-picker-selected-text text-sm text-zinc-500 font-medium">
                        {selectedIds.length > 0 ? (
                            <span className="text-[var(--gold)]">{selectedIds.length} {t('files_selected')}</span>
                        ) : <span>{t('no_file_selected')}</span>}
                    </div>
                    <div className="flex space-x-3">
                        <button type="button" onClick={onClose} className="media-picker-btn-cancel px-4 py-2 border text-xs font-semibold uppercase tracking-widest transition-all duration-200 rounded-xl">
                            {t('cancel')}
                        </button>
                        <PrimaryButton onClick={handleConfirm} disabled={selectedIds.length === 0} className="media-picker-btn-confirm disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.25)] !rounded-xl">
                            {t('select_media')}
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
