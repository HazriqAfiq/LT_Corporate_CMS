import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Plus, Edit, Trash, Settings, Save, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import debounce from 'lodash/debounce';
import { useDropzone } from 'react-dropzone';

const BRANDING_FIELDS = [
    {
        key: 'logo',
        label: 'Logo Utama',
        desc: 'Dipaparkan di navbar dan laman utama.',
        size: 'PNG / SVG — 200×60 px disyorkan',
        accept: { 'image/*': ['.png', '.svg', '.jpg', '.jpeg', '.webp'] },
    },
    {
        key: 'logo_dark',
        label: 'Logo Mod Gelap',
        desc: 'Versi logo untuk latar belakang gelap.',
        size: 'PNG / SVG — 200×60 px disyorkan',
        accept: { 'image/*': ['.png', '.svg', '.jpg', '.jpeg', '.webp'] },
    },
    {
        key: 'logo_footer',
        label: 'Logo Footer',
        desc: 'Dipaparkan di bahagian footer laman web.',
        size: 'PNG / SVG — 160×50 px disyorkan',
        accept: { 'image/*': ['.png', '.svg', '.jpg', '.jpeg', '.webp'] },
    },
    {
        key: 'favicon',
        label: 'Favicon',
        desc: 'Ikon tab pelayar. Gunakan format ICO atau PNG.',
        size: 'ICO / PNG — 32×32 px atau 64×64 px',
        accept: { 'image/*': ['.ico', '.png', '.svg'] },
    },
    {
        key: 'login_background',
        label: 'Latar Belakang Log Masuk',
        desc: 'Imej latar halaman log masuk admin.',
        size: 'JPG / PNG — 1920×1080 px disyorkan',
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    },
];

function BrandingCard({ field, currentValue }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(currentValue?.value || null);
    const [removing, setRemoving] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: field.accept,
        maxSize: 5 * 1024 * 1024,
        multiple: false,
        onDrop: (accepted) => {
            if (accepted[0]) {
                setFile(accepted[0]);
                setPreview(URL.createObjectURL(accepted[0]));
                setSaved(false);
            }
        },
    });

    const handleSave = async () => {
        if (!file) return;
        setSaving(true);
        const fd = new FormData();
        fd.append(field.key, file);
        fd.append('_token', document.querySelector('meta[name="csrf-token"]')?.content);
        fd.append('_method', 'POST');

        const res = await fetch(route('admin.branding.update'), { method: 'POST', body: fd });
        if (res.ok || res.redirected) {
            setSaved(true);
            setFile(null);
            setTimeout(() => setSaved(false), 3000);
            router.reload({ only: ['brandingSettings'] });
        }
        setSaving(false);
    };

    const handleRemove = async () => {
        if (!confirm('Buang imej branding ini?')) return;
        setRemoving(true);
        await fetch(route('admin.branding.remove'), {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content,
            },
            body: JSON.stringify({ key: field.key }),
        });
        setPreview(null);
        setFile(null);
        setRemoving(false);
        router.reload({ only: ['brandingSettings'] });
    };

    const hasNew = !!file;
    const hasCurrent = !!preview;

    return (
        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-base font-bold text-white">{field.label}</h3>
                <p className="text-sm text-zinc-500 mt-0.5">{field.desc}</p>
                <p className="text-xs text-zinc-600 mt-1">📐 {field.size}</p>
            </div>

            <div className="p-6 flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex-1 w-full">
                    {hasCurrent ? (
                        <div className={`relative group rounded-xl overflow-hidden border ${hasNew ? 'border-[var(--gold)]/40' : 'border-white/10'} bg-[#080808]`}>
                            {hasNew && (
                                <div className="absolute top-2 left-2 bg-[var(--gold)] text-[#080808] text-[9px] font-bold px-2 py-0.5 rounded-full z-10">
                                    Pratonton Baru
                                </div>
                            )}
                            <div className="p-4 flex items-center justify-center min-h-[100px]">
                                <img
                                    src={preview}
                                    alt={field.label}
                                    className="max-h-28 max-w-full object-contain"
                                />
                            </div>
                            {!hasNew && hasCurrent && (
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <label className="px-3 py-1.5 bg-[var(--gold)] text-[#080808] text-xs font-bold rounded-lg cursor-pointer">
                                        Ganti
                                        <input type="file" className="hidden" accept={Object.keys(field.accept).join(',')} onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); } }} />
                                    </label>
                                    <button onClick={handleRemove} disabled={removing} className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 disabled:opacity-50">
                                        {removing ? '...' : 'Buang'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                isDragActive ? 'border-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 hover:border-[var(--gold)]/30 hover:bg-white/[0.02]'
                            }`}
                        >
                            <input {...getInputProps()} />
                            <ImageIcon className={`w-10 h-10 mb-3 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-600'}`} />
                            <p className="text-sm text-zinc-400 text-center">
                                {isDragActive ? 'Lepaskan imej...' : 'Tiada imej ditetapkan'}
                            </p>
                            <p className="text-xs text-zinc-600 mt-1">Tarik & lepas atau klik untuk muat naik</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                    {hasNew ? (
                        <>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-5 py-2.5 rounded-xl bg-[var(--gold)] text-[#080808] text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition disabled:opacity-50"
                            >
                                {saving
                                    ? <div className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin" />
                                    : <Save className="w-4 h-4" />
                                }
                                {saving ? 'Menyimpan...' : 'Simpan'}
                            </button>
                            <button
                                onClick={() => { setFile(null); setPreview(currentValue?.value || null); }}
                                className="px-5 py-2.5 rounded-xl border border-white/10 text-zinc-400 text-sm flex items-center justify-center gap-2 hover:bg-white/5 transition"
                            >
                                <X className="w-4 h-4" /> Batal
                            </button>
                        </>
                    ) : saved ? (
                        <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-medium py-2">
                            <CheckCircle2 className="w-4 h-4" /> Disimpan!
                        </div>
                    ) : !hasCurrent ? (
                        <label className="px-5 py-2.5 rounded-xl bg-[#080808] border border-white/10 text-zinc-300 text-sm flex items-center justify-center gap-2 cursor-pointer hover:border-[var(--gold)]/30 transition">
                            <ImageIcon className="w-4 h-4" /> Pilih Fail
                            <input type="file" className="hidden" accept={Object.keys(field.accept).join(',')} onChange={e => { if (e.target.files?.[0]) { setFile(e.target.files[0]); setPreview(URL.createObjectURL(e.target.files[0])); } }} />
                        </label>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default function Index({ settings, brandingSettings, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [groupFilter, setGroupFilter] = useState(filters.group || '');
    const [activeTab, setActiveTab] = useState(() => {
        if (typeof window !== 'undefined') {
            const queryParams = new URLSearchParams(window.location.search);
            return queryParams.get('tab') === 'branding' ? 'branding' : 'general';
        }
        return 'general';
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (tab === 'branding') {
                url.searchParams.set('tab', 'branding');
            } else {
                url.searchParams.delete('tab');
            }
            window.history.replaceState({}, '', url.pathname + url.search);
        }
    };

    const fetchSettings = (searchValue, groupValue) => {
        const query = {};
        if (searchValue) query.search = searchValue;
        if (groupValue) query.group = groupValue;
        
        router.get('/admin/settings', query, { preserveState: true, replace: true });
    };

    const handleSearch = debounce((value, groupValue) => {
        fetchSettings(value, groupValue);
    }, 300);

    const onSearchChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value, groupFilter);
    };

    const onGroupChange = (e) => {
        setGroupFilter(e.target.value);
        fetchSettings(search, e.target.value);
    };

    const handleDelete = (id) => {
        if (confirm('Anda pasti ingin memadam tetapan ini?')) {
            router.delete(`/admin/settings/${id}`);
        }
    };

    const getGroupBadgeColor = (group) => {
        switch(group) {
            case 'general': return 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20';
            case 'contact': return 'bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20';
            case 'social': return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
            case 'company': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
            case 'footer': return 'bg-[#080808] text-gray-800 dark:bg-gray-700 text-zinc-300';
            default: return 'bg-[#080808] text-gray-800 dark:bg-gray-700 text-zinc-300';
        }
    };

    return (
        <AdminLayout header="Tetapan Website">
            <Head title="Tetapan | Admin" />

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/5 mb-6">
                <button
                    onClick={() => handleTabChange('general')}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all focus:outline-none ${
                        activeTab === 'general'
                            ? 'border-[var(--gold)] text-[var(--gold)]'
                            : 'border-transparent text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                >
                    Tetapan Umum
                </button>
                <button
                    onClick={() => handleTabChange('branding')}
                    className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all focus:outline-none ${
                        activeTab === 'branding'
                            ? 'border-[var(--gold)] text-[var(--gold)]'
                            : 'border-transparent text-zinc-400 hover:text-white hover:border-white/10'
                    }`}
                >
                    Imej & Branding
                </button>
            </div>

            {activeTab === 'general' ? (
                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 flex flex-col min-h-[500px]">
                    <div className="px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-zinc-500" />
                                </div>
                                <input
                                    type="text"
                                    className="block w-full pl-10 pr-3 py-2 bg-[#080808] border border-white/10 text-white rounded-xl text-sm placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors"
                                    placeholder="Cari kunci atau label..."
                                    value={search}
                                    onChange={onSearchChange}
                                />
                            </div>
                            <select
                                value={groupFilter}
                                onChange={onGroupChange}
                                className="block w-full sm:w-40 py-2 pl-3 pr-10 border border-white/10 bg-[#080808] text-white rounded-xl focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] sm:text-sm"
                            >
                                <option value="">Semua Kumpulan</option>
                                <option value="general">Umum</option>
                                <option value="contact">Hubungan</option>
                                <option value="social">Media Sosial</option>
                                <option value="company">Syarikat</option>
                                <option value="footer">Footer</option>
                            </select>
                        </div>
                        <Link
                            href={route('admin.settings.create')}
                            className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition-all duration-200"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Tambah Tetapan
                        </Link>
                    </div>

                    <div className="overflow-x-auto flex-1">
                        <table className="min-w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-[#080808]/50 text-zinc-500 text-xs font-semibold uppercase tracking-wider">
                                    <th className="px-6 py-3 font-semibold">Kunci (Key)</th>
                                    <th className="px-6 py-3 font-semibold">Label</th>
                                    <th className="px-6 py-3 font-semibold">Kumpulan</th>
                                    <th className="px-6 py-3 font-semibold">Jenis</th>
                                    <th className="px-6 py-3 font-semibold">Nilai</th>
                                    <th className="px-6 py-3 font-semibold text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                                {settings.data.map((setting) => (
                                    <tr key={setting.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <Settings className="w-4 h-4 text-gray-400 mr-2" />
                                                <span className="text-sm font-medium text-white font-mono">{setting.key}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-zinc-300">
                                                {setting.label || '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wide ${getGroupBadgeColor(setting.group)}`}>
                                                {setting.group}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#080808] text-zinc-300 uppercase tracking-wide">
                                                {setting.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-zinc-500 truncate max-w-[200px]" title={setting.value}>
                                                {setting.type === 'image' && setting.value ? (
                                                    <img
                                                        src={setting.value.startsWith('http') || setting.value.startsWith('/storage') ? setting.value : `/storage/${setting.value}`}
                                                        alt={setting.label}
                                                        className="w-10 h-10 object-cover rounded-lg border border-white/10 shadow-md shadow-black/35 hover:scale-105 transition-transform duration-200"
                                                    />
                                                ) : (
                                                    setting.value || '-'
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={route('admin.settings.edit', setting.id)}
                                                    className="text-zinc-500 hover:text-[var(--gold)] transition-colors p-1"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(setting.id)}
                                                    className="text-gray-400 hover:text-red-400 transition-colors p-1"
                                                    title="Delete"
                                                >
                                                    <Trash className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {settings.data.length === 0 && (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-zinc-500">
                                            Tiada tetapan dijumpai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {settings.links?.length > 3 && (
                        <div className="px-6 py-4 border-t border-white/5 bg-[#080808]/30">
                            <div className="flex flex-wrap gap-1">
                                {settings.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        className={`px-3 py-1 rounded text-sm ${
                                            link.active 
                                                ? 'bg-[var(--gold)] text-[#080808] font-bold' 
                                                : !link.url 
                                                    ? 'text-gray-400 cursor-not-allowed' 
                                                    : 'bg-white dark:bg-gray-800 text-zinc-300 border border-white/10 hover:bg-[#080808] dark:hover:bg-white/5'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 px-6 py-5">
                        <h2 className="text-lg font-bold text-white mb-1">Pengurusan Imej Branding</h2>
                        <p className="text-sm text-zinc-500">
                            Urus logo, favicon, dan imej latar yang dipaparkan di seluruh laman web awam dan panel admin.
                            Imej yang dimuat naik akan terus dikemaskini secara langsung.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {BRANDING_FIELDS.map(field => (
                            <BrandingCard
                                key={field.key}
                                field={field}
                                currentValue={brandingSettings[field.key] || null}
                            />
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
