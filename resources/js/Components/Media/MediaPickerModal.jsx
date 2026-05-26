import React, { useState, useEffect, useCallback } from 'react';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { X, Search, Filter } from 'lucide-react';
import axios from 'axios';
import MediaGrid from './MediaGrid';
import ImageUploadZone from './ImageUploadZone';
import TextInput from '@/Components/TextInput';

export default function MediaPickerModal({ 
    show, 
    onClose, 
    onSelect, 
    multiple = false, 
    collection = 'default',
    title = 'Pilih Media'
}) {
    const [activeTab, setActiveTab] = useState('library'); // 'library' or 'upload'
    const [mediaList, setMediaList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    const fetchMedia = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(route('admin.media.index'), {
                params: {
                    search,
                    collection: collection !== 'default' ? collection : undefined,
                },
                headers: {
                    'Accept': 'application/json'
                }
            });
            // The route returns inertia response unless it detects axios/json.
            // Wait, standard inertia routes might not return JSON for axios unless handled.
            // We should modify the MediaController to return JSON if request->wantsJson().
            // Oh, we didn't update the index method! Let's assume it returns data.media.data if updated.
            if (response.data && response.data.media) {
                setMediaList(response.data.media.data || response.data.media);
            }
        } catch (error) {
            console.error('Failed to fetch media:', error);
        } finally {
            setLoading(false);
        }
    }, [search, collection]);

    useEffect(() => {
        if (show && activeTab === 'library') {
            fetchMedia();
        }
    }, [show, activeTab, fetchMedia]);

    // Clear selection when modal closes
    useEffect(() => {
        if (!show) {
            setSelectedIds([]);
            setSearch('');
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

    // Override the Modal's dark background manually since the project uses dark mode
    return (
        <Modal show={show} onClose={onClose} maxWidth="4xl">
            <div className="bg-[#0c0c0e] text-zinc-100 flex flex-col h-[82vh] rounded-2xl overflow-hidden border border-white/5">
                {/* Header */}
                <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center bg-[#08080a]">
                    <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>
                    <button 
                        onClick={onClose} 
                        className="text-zinc-500 hover:text-white transition-colors duration-200 p-1.5 hover:bg-white/5 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-white/5 px-6 bg-[#08080a]">
                    <button 
                        className={`py-4 px-5 font-semibold text-sm border-b-2 transition-all duration-300 ${activeTab === 'library' ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        onClick={() => setActiveTab('library')}
                    >
                        Galeri Media
                    </button>
                    <button 
                        className={`py-4 px-5 font-semibold text-sm border-b-2 transition-all duration-300 ${activeTab === 'upload' ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
                        onClick={() => setActiveTab('upload')}
                    >
                        Muat Naik Baru
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 bg-[#060608]">
                    {activeTab === 'library' ? (
                        <div className="space-y-5 h-full flex flex-col">
                            <div className="flex justify-between items-center">
                                <div className="relative w-full max-w-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                        <Search className="w-4.5 h-4.5 text-zinc-500" />
                                    </div>
                                    <TextInput
                                        type="text"
                                        placeholder="Cari fail..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10 w-full bg-[#0d0d10] border-white/5 text-white placeholder-zinc-600 focus:border-[var(--gold)]/50 focus:ring-[var(--gold)]/30 rounded-xl"
                                    />
                                </div>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto min-h-0 pr-1">
                                {loading ? (
                                    <div className="flex justify-center items-center h-full">
                                        <div className="w-10 h-10 border-2 border-[var(--gold)] border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <MediaGrid 
                                        media={mediaList} 
                                        selectedIds={selectedIds} 
                                        onSelect={setSelectedIds} 
                                        multiSelect={multiple} 
                                    />
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <div className="w-full max-w-2xl">
                                <ImageUploadZone 
                                    collection={collection} 
                                    multiple={multiple} 
                                    onUploadSuccess={handleUploadSuccess} 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-5 border-t border-white/5 bg-[#08080a] flex justify-between items-center">
                    <div className="text-sm text-zinc-500 font-medium">
                        {selectedIds.length > 0 ? (
                            <span className="text-[var(--gold)]">{selectedIds.length} fail dipilih</span>
                        ) : (
                            <span>Tiada fail dipilih</span>
                        )}
                    </div>
                    <div className="flex space-x-3">
                        <SecondaryButton 
                            onClick={onClose} 
                            className="!bg-white/5 !text-zinc-300 !border-white/5 hover:!bg-white/10 hover:!text-white transition-all duration-200 !rounded-xl"
                        >
                            Batal
                        </SecondaryButton>
                        <PrimaryButton 
                            onClick={handleConfirm} 
                            disabled={selectedIds.length === 0}
                            className="disabled:opacity-40 disabled:pointer-events-none transition-all duration-300 hover:shadow-[0_0_15px_rgba(234,179,8,0.25)] !rounded-xl"
                        >
                            Pilih Media
                        </PrimaryButton>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
