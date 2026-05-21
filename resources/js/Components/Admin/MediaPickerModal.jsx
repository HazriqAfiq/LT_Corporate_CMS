import React, { useState, useEffect, useCallback } from 'react';
import { router } from '@inertiajs/react';
import { Search, X, Check, Image as ImageIcon, Copy, ExternalLink } from 'lucide-react';
import debounce from 'lodash/debounce';

/**
 * Modal to pick an existing image from the Media Library.
 *
 * Props:
 *   isOpen      — boolean
 *   onClose     — () => void
 *   onSelect    — (url: string, path: string, media: object) => void
 *   collection  — string  pre-filter (optional)
 */
export default function MediaPickerModal({ isOpen, onClose, onSelect, collection = '' }) {
    const [search, setSearch] = useState('');
    const [selectedCollection, setSelectedCollection] = useState(collection);
    const [media, setMedia] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [page, setPage] = useState(1);

    const COLLECTIONS = ['', 'sliders', 'pages', 'articles', 'products', 'portfolio', 'users', 'seo', 'settings'];

    const fetchMedia = useCallback(
        debounce(async (searchVal, col, pg) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({ page: pg });
                if (searchVal) params.append('search', searchVal);
                if (col) params.append('collection', col);
                params.append('type', 'image');

                const res = await fetch(`/admin/media?${params}`, {
                    headers: { 'X-Inertia': 'true', 'X-Inertia-Version': '1' },
                });
                const json = await res.json();
                setMedia(json?.props?.media?.data ?? []);
                setPagination(json?.props?.media ?? null);
            } catch {
                // Fallback: try standard JSON endpoint
            } finally {
                setLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (isOpen) {
            setSelected(null);
            fetchMedia(search, selectedCollection, page);
        }
    }, [isOpen, search, selectedCollection, page]);

    const handleConfirm = () => {
        if (!selected) return;
        onSelect(`/storage/${selected.path}`, selected.path, selected);
        onClose();
    };

    const handleCopyUrl = (url) => {
        navigator.clipboard.writeText(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal panel */}
            <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col bg-[#0c0c0e] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                    <h2 className="text-lg font-bold text-white">Pilih dari Perpustakaan Media</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Filters */}
                <div className="px-6 py-3 border-b border-white/5 flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Cari fail media..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            className="w-full pl-9 pr-3 py-2 bg-[#080808] border border-white/10 text-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)] placeholder-zinc-600"
                        />
                    </div>
                    <select
                        value={selectedCollection}
                        onChange={(e) => { setSelectedCollection(e.target.value); setPage(1); }}
                        className="py-2 pl-3 pr-8 bg-[#080808] border border-white/10 text-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)]"
                    >
                        <option value="">Semua Koleksi</option>
                        {COLLECTIONS.filter(Boolean).map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                    </select>
                </div>

                {/* Media grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
                        </div>
                    ) : media.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-zinc-500">
                            <ImageIcon className="w-10 h-10 mb-2" />
                            <p className="text-sm">Tiada imej dijumpai</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            {media.map((item) => {
                                if (!item.mime_type?.startsWith('image/')) return null;
                                const isSelected = selected?.id === item.id;
                                const url = `/storage/${item.path}`;

                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelected(isSelected ? null : item)}
                                        className={`group relative rounded-xl overflow-hidden border cursor-pointer transition-all ${
                                            isSelected
                                                ? 'border-[var(--gold)] ring-2 ring-[var(--gold)]/30'
                                                : 'border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div className="aspect-square bg-[#080808]">
                                            <img
                                                src={url}
                                                alt={item.alt_text || item.original_filename}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </div>

                                        {/* Selected checkmark */}
                                        {isSelected && (
                                            <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[var(--gold)] flex items-center justify-center">
                                                <Check className="w-3.5 h-3.5 text-[#080808]" />
                                            </div>
                                        )}

                                        {/* Copy URL on hover */}
                                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button
                                                type="button"
                                                onClick={(e) => { e.stopPropagation(); handleCopyUrl(url); }}
                                                className="flex-1 py-1 rounded bg-white/10 text-white text-[9px] flex items-center justify-center gap-1 hover:bg-white/20"
                                                title="Salin URL"
                                            >
                                                <Copy className="w-2.5 h-2.5" />
                                            </button>
                                        </div>

                                        {/* Filename */}
                                        <div className="px-2 py-1.5 bg-[#0c0c0e]">
                                            <p className="text-[10px] text-zinc-400 truncate">{item.original_filename}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-sm text-zinc-500">
                        {selected
                            ? <span className="text-[var(--gold)] font-medium">✓ {selected.original_filename}</span>
                            : 'Tiada imej dipilih'}
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 rounded-xl border border-white/10 text-zinc-300 text-sm hover:bg-white/5 transition"
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirm}
                            disabled={!selected}
                            className="px-5 py-2 rounded-xl bg-[var(--gold)] text-[#080808] text-sm font-bold hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Guna Imej Ini
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
