import React, { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Check, Image as ImageIcon, X } from 'lucide-react';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import useTranslation from '@/Hooks/useTranslation';

const BRANDING_FIELDS = [
    {
        key: 'logo',
        label: 'Logo Utama',
        label_en: 'Main Logo',
        desc: 'Dipaparkan di navbar dan laman utama. Juga digunakan sebagai fallback SEO bersama imej latar belakang.',
        desc_en: 'Displayed on the navbar and home page. Also used as a fallback for SEO link previews.',
        size: 'PNG / SVG — 200×60 px disyorkan',
        size_en: 'PNG / SVG — 200×60 px recommended',
        accept: { 'image/*': ['.png', '.svg', '.jpg', '.jpeg', '.webp'] },
    },
    {
        key: 'logo_dark',
        label: 'Logo Mod Gelap',
        label_en: 'Dark Mode Logo',
        desc: 'Versi logo untuk latar belakang gelap.',
        desc_en: 'Logo version for dark backgrounds.',
        size: 'PNG / SVG — 200×60 px disyorkan',
        size_en: 'PNG / SVG — 200×60 px recommended',
        accept: { 'image/*': ['.png', '.svg', '.jpg', '.jpeg', '.webp'] },
    },
    {
        key: 'logo_footer',
        label: 'Logo Footer',
        label_en: 'Footer Logo',
        desc: 'Dipaparkan di bahagian footer laman web.',
        desc_en: 'Displayed in the website footer section.',
        size: 'PNG / SVG — 160×50 px disyorkan',
        size_en: 'PNG / SVG — 160×50 px recommended',
        accept: { 'image/*': ['.png', '.svg', '.jpg', '.jpeg', '.webp'] },
    },
    {
        key: 'favicon',
        label: 'Favicon',
        label_en: 'Favicon',
        desc: 'Ikon tab pelayar. Gunakan format ICO atau PNG.',
        desc_en: 'Browser tab icon. Use ICO or PNG format.',
        size: 'ICO / PNG — 32×32 px atau 64×64 px',
        size_en: 'ICO / PNG — 32×32 px or 64×64 px',
        accept: {
            'image/x-icon': ['.ico'],
            'image/vnd.microsoft.icon': ['.ico'],
            'image/png': ['.png'],
            'image/svg+xml': ['.svg']
        },
    },
    {
        key: 'login_background',
        label: 'Latar Belakang Log Masuk',
        label_en: 'Login Background',
        desc: 'Imej latar halaman log masuk admin.',
        desc_en: 'Background image of the admin login page.',
        size: 'JPG / PNG — 1920×1080 px disyorkan',
        size_en: 'JPG / PNG — 1920×1080 px recommended',
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    },
    {
        key: 'homepage_background',
        label: 'Latar Belakang Laman Utama',
        label_en: 'Homepage Background',
        desc: 'Imej latar belakang utama (parallax/skyline) di laman web awam. Imej ini juga digunakan sebagai fallback lakaran kenit SEO jika Imej SEO Lalai tidak ditetapkan.',
        desc_en: 'Main background image (parallax/skyline) on the public website. This image is also used as the fallback SEO preview thumbnail if the Default SEO Image is not set.',
        size: 'JPG / PNG / WebP — 1920×1080 px disyorkan',
        size_en: 'JPG / PNG / WebP — 1920×1080 px recommended',
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.avif'] },
    },
];

function BrandingCard({ field, currentValue }) {
    const { t, lang } = useTranslation();
    const { csrf_token } = usePage().props;
    const [mediaId, setMediaId] = useState(currentValue?.value || null);
    // Track the last-saved value so hasChanged returns false after a successful save
    const [savedMediaId, setSavedMediaId] = useState(currentValue?.value || null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch(route('admin.branding.update-media', undefined, false), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf_token,
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ key: field.key, media_id: mediaId }),
            });
            if (res.ok) {
                // Update baseline so hasChanged becomes false → button goes dark (disabled)
                setSavedMediaId(mediaId);
                setSaved(true);
                setTimeout(() => setSaved(false), 1500);
                router.reload({ only: ['brandingSettings'] });
            } else {
                const data = await res.json();
                setError(data.message || t('error_saving_image'));
            }
        } catch (e) {
            setError(t('server_error'));
        } finally {
            setSaving(false);
        }
    };

    const handleDiscard = () => {
        setMediaId(savedMediaId);
        setError(null);
    };

    const hasChanged = mediaId !== savedMediaId;

    const activeLabel = lang === 'en' ? (field.label_en || field.label) : field.label;
    const activeDesc = lang === 'en' ? (field.desc_en || field.desc) : field.desc;
    const activeSize = lang === 'en' ? (field.size_en || field.size) : field.size;

    return (
        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 hover:border-white/10 shadow-xl flex flex-col h-full">
            {/* Header info */}
            <div className="px-6 py-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 bg-[#0e0e11]/50 shrink-0">
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-white tracking-wide">{activeLabel}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{activeDesc}</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-1">📐 {activeSize}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <button
                        onClick={handleDiscard}
                        disabled={!hasChanged || saving}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 font-sans ${
                            hasChanged && !saving
                                ? 'bg-zinc-700 text-white hover:bg-zinc-600 shadow-md shadow-zinc-700/10 cursor-pointer [.light_&]:bg-zinc-200 [.light_&]:text-zinc-800 [.light_&]:hover:bg-zinc-300/80 [.light_&]:shadow-zinc-200/20'
                                : 'bg-zinc-800 text-zinc-500 opacity-40 cursor-not-allowed [.light_&]:bg-zinc-100 [.light_&]:text-zinc-400 [.light_&]:opacity-60'
                        }`}
                    >
                        <X className="w-3.5 h-3.5" />
                        {t('discard_changes')}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={!hasChanged || saving || saved}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-300 font-sans ${
                            saved
                                ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 cursor-default'
                                : hasChanged && !saving
                                    ? 'bg-[var(--gold)] text-[#080808] hover:opacity-90 shadow-md shadow-[var(--gold)]/10'
                                    : 'bg-zinc-800 text-zinc-500 opacity-40 cursor-not-allowed'
                        }`}
                    >
                        {saving ? (
                            <div className="w-3.5 h-3.5 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                        ) : saved ? (
                            <Check className="w-3.5 h-3.5" />
                        ) : (
                            <Save className="w-3.5 h-3.5" />
                        )}
                        {saving ? t('saving') : saved ? t('saved') : t('save')}
                    </button>
                </div>
            </div>

            {/* Media Selector body */}
            <div className="p-6 flex-1 flex flex-col justify-center bg-black/20">
                {error && (
                    <div className="mb-4 text-xs text-red-400 bg-red-950/20 border border-red-900/20 px-3.5 py-2.5 rounded-xl">
                        {error}
                    </div>
                )}
                
                <MediaSelectorInput
                    label=""
                    value={mediaId}
                    onChange={val => setMediaId(val)}
                    collection="branding"
                    initialMedia={currentValue?.media || null}
                />
            </div>
        </div>
    );
}

export default function Index({ brandingSettings }) {
    const { t } = useTranslation();
    return (
        <AdminLayout header={t('branding_title')}>
            <Head title={`${t('branding_title')} | Admin`} />

            {/* Page Header Intro */}
            <div className="bg-gradient-to-r from-[#0c0c0e] to-zinc-950 p-6 rounded-2xl border border-white/5 shadow-2xl mb-8 relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-[var(--gold)]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--gold)]/10 text-[var(--gold)] rounded-xl border border-[var(--gold)]/20 mt-0.5">
                        <ImageIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white tracking-wide">
                            {t('branding_mgmt')}
                        </h2>
                        <p className="text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
                            {t('branding_mgmt_desc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Branding fields grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {BRANDING_FIELDS.map((field) => (
                    <div key={field.key} className="h-full">
                        <BrandingCard 
                            field={field} 
                            currentValue={brandingSettings[field.key] || null} 
                        />
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
