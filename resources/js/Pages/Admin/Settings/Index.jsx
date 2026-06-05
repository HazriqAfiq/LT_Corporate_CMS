import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { 
    Search, Plus, Edit, Trash, Settings, Save, CheckCircle2, Check,
    Globe, Phone, Share2, Building2, FileText, Eye, AlertCircle,
    LayoutGrid, List, ArrowUp, ArrowDown
} from 'lucide-react';
import debounce from 'lodash/debounce';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import RichTextEditor from '@/Components/Admin/RichTextEditor';

const BILINGUAL_KEYS = [
    'site_name',
    'site_tagline',
    'site_description',
    'contact_address',
    'company_about',
    'company_background',
    'company_vision',
    'company_mission',
    'footer_text'
];

// Parsing & Stringifying utilities for the interactive Journey Editor
const parseJourneyString = (str) => {
    if (!str) return [];
    return str.split("\n").map(line => {
        const parts = line.split("|").map(p => p.trim());
        const year = parts[0] || '';
        const titleStr = parts[1] || '';
        const descStr = parts[2] || '';

        const titleBM = titleStr.split('/')[0]?.trim() || '';
        const titleEN = titleStr.split('/')[1]?.trim() || '';

        const descBM = descStr.split('/')[0]?.trim() || '';
        const descEN = descStr.split('/')[1]?.trim() || '';

        return { year, titleBM, titleEN, descBM, descEN };
    }).filter(m => m.year || m.titleBM || m.descBM);
};

const stringifyJourneyArray = (arr) => {
    return arr.map(m => {
        const year = m.year ? m.year.trim() : '';
        const titleBM = m.titleBM ? m.titleBM.trim() : '';
        const titleEN = m.titleEN ? m.titleEN.trim() : '';
        const descBM = m.descBM ? m.descBM.trim() : '';
        const descEN = m.descEN ? m.descEN.trim() : '';

        const title = titleEN ? `${titleBM} / ${titleEN}` : titleBM;
        const desc = descEN ? `${descBM} / ${descEN}` : descBM;

        return `${year} | ${title} | ${desc}`;
    }).join("\n");
};

// Premium Interactive Milestones Editor Component
function JourneyEditor({ value, onChange }) {
    const [items, setItems] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        if (items.length === 0 && value) {
            setItems(parseJourneyString(value));
        } else if (!value) {
            setItems([]);
        }
    }, [value]);

    const updateParent = (newItems) => {
        setItems(newItems);
        onChange(stringifyJourneyArray(newItems));
    };

    const handleFieldChange = (index, field, val) => {
        const updated = [...items];
        updated[index] = { ...updated[index], [field]: val };
        updateParent(updated);
    };

    const handleAdd = () => {
        const updated = [...items, { year: '', titleBM: '', titleEN: '', descBM: '', descEN: '' }];
        updateParent(updated);
    };

    const handleDelete = (index) => {
        const updated = items.filter((_, i) => i !== index);
        updateParent(updated);
    };

    const handleMove = (index, direction) => {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === items.length - 1) return;

        const updated = [...items];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        const temp = updated[index];
        updated[index] = updated[swapIndex];
        updated[swapIndex] = temp;

        updateParent(updated);
    };

    return (
        <div className="space-y-4">
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div 
                        key={index} 
                        className="p-4 bg-[#0e0e11] rounded-xl border border-white/5 hover:border-[var(--gold)]/20 transition-all space-y-3 relative group"
                    >
                        {/* Rearrange & Delete Toolbar */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                            <span className="text-xs font-bold text-zinc-500 font-sans">{t('milestone')} #{index + 1}</span>
                            <div className="flex items-center gap-1.5">
                                <button
                                    type="button"
                                    onClick={() => handleMove(index, 'up')}
                                    disabled={index === 0}
                                    className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent transition"
                                    title={t('move_up')}
                                >
                                    <ArrowUp className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleMove(index, 'down')}
                                    disabled={index === items.length - 1}
                                    className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded disabled:opacity-30 disabled:hover:bg-transparent transition"
                                    title={t('move_down')}
                                >
                                    <ArrowDown className="w-4 h-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(index)}
                                    className="p-1 hover:bg-red-950/40 text-zinc-400 hover:text-red-400 rounded transition ml-2"
                                    title={t('delete')}
                                >
                                    <Trash className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Year & Title BM / EN Row */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                            <div className="md:col-span-2">
                                <label className="text-[10px] text-zinc-500 font-bold block mb-1 font-sans">{t('year')}</label>
                                <input
                                    type="text"
                                    placeholder={t('milestone_year_placeholder')}
                                    value={item.year}
                                    onChange={e => handleFieldChange(index, 'year', e.target.value)}
                                    className="w-full bg-[#080808] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--gold)] font-sans"
                                />
                            </div>
                            <div className="md:col-span-5">
                                <label className="text-[10px] text-zinc-500 font-bold block mb-1 font-sans">{t('title_bm')}</label>
                                <input
                                    type="text"
                                    placeholder={t('title_bm_placeholder')}
                                    value={item.titleBM}
                                    onChange={e => handleFieldChange(index, 'titleBM', e.target.value)}
                                    className="w-full bg-[#080808] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--gold)] font-sans"
                                />
                            </div>
                            <div className="md:col-span-5">
                                <label className="text-[10px] text-zinc-500 font-bold block mb-1 font-sans">{t('title_en')}</label>
                                <input
                                    type="text"
                                    placeholder={t('title_en_placeholder')}
                                    value={item.titleEN}
                                    onChange={e => handleFieldChange(index, 'titleEN', e.target.value)}
                                    className="w-full bg-[#080808] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--gold)] font-sans"
                                />
                            </div>
                        </div>

                        {/* Description BM / EN Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] text-zinc-500 font-bold block mb-1 font-sans">{t('desc_bm')}</label>
                                <textarea
                                    placeholder={t('desc_bm_placeholder')}
                                    rows={2}
                                    value={item.descBM}
                                    onChange={e => handleFieldChange(index, 'descBM', e.target.value)}
                                    className="w-full bg-[#080808] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--gold)] resize-none font-sans"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] text-zinc-500 font-bold block mb-1 font-sans">{t('desc_en')}</label>
                                <textarea
                                    placeholder={t('desc_en_placeholder')}
                                    rows={2}
                                    value={item.descEN}
                                    onChange={e => handleFieldChange(index, 'descEN', e.target.value)}
                                    className="w-full bg-[#080808] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-[var(--gold)] resize-none font-sans"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {items.length === 0 && (
                <div className="text-center py-6 border border-dashed border-white/5 rounded-xl bg-[#080808]/20">
                    <p className="text-xs text-zinc-600 font-sans">{t('no_milestones_desc')}</p>
                </div>
            )}

            <button
                type="button"
                onClick={handleAdd}
                className="w-full py-2.5 rounded-xl border border-dashed border-white/10 hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 text-zinc-400 hover:text-[var(--gold)] text-xs font-bold flex items-center justify-center gap-2 transition font-sans"
            >
                <Plus className="w-4 h-4" /> {t('add_milestone')}
            </button>
        </div>
    );
}

// Bilingual guidance metadata for each setting field
const SETTING_GUIDANCE = {
    site_name: {
        desc_bm: 'Nama rasmi laman web atau syarikat anda.',
        desc_en: 'The official name of your website or company.',
        pages_bm: ['Laman Utama', 'Semua Halaman'],
        pages_en: ['Home Page', 'All Pages'],
        location_bm: 'Dipaparkan pada tajuk pelayar (browser tab) dan e-mel pemberitahuan.',
        location_en: 'Displayed on the browser tab title and notification emails.'
    },
    site_tagline: {
        desc_bm: 'Slogan pendek yang dipaparkan bersebelahan nama laman.',
        desc_en: 'A short slogan shown next to the site name.',
        pages_bm: ['Laman Utama', 'Semua Halaman'],
        pages_en: ['Home Page', 'All Pages'],
        location_bm: 'Dipaparkan di tajuk pelayar (browser tab) selepas nama laman.',
        location_en: 'Displayed on the browser tab title after the site name.'
    },
    site_description: {
        desc_bm: 'Penerangan ringkas tentang laman web anda untuk carian Google (SEO).',
        desc_en: 'A brief description of your website for Google search indexing (SEO).',
        pages_bm: ['Semua Halaman'],
        pages_en: ['All Pages'],
        location_bm: 'Digunakan sebagai meta tag description lalai untuk enjin carian.',
        location_en: 'Used as the default meta description tag for search engines.'
    },
    contact_email: {
        desc_bm: 'Alamat e-mel rasmi syarikat.',
        desc_en: 'Official company email address.',
        pages_bm: ['Hubungi Kami', 'Footer'],
        pages_en: ['Contact Us', 'Footer'],
        location_bm: 'Dipaparkan di halaman Hubungi Kami, bar atas navbar, dan bahagian footer.',
        location_en: 'Displayed on the Contact Us page, top navbar, and footer section.'
    },
    contact_phone: {
        desc_bm: 'Nombor telefon pejabat atau khidmat pelanggan.',
        desc_en: 'Office or customer service phone number.',
        pages_bm: ['Hubungi Kami', 'Footer'],
        pages_en: ['Contact Us', 'Footer'],
        location_bm: 'Dipaparkan di halaman Hubungi Kami dan bahagian footer.',
        location_en: 'Displayed on the Contact Us page and footer section.'
    },
    contact_address: {
        desc_bm: 'Alamat fizikal penuh pejabat atau premis perniagaan.',
        desc_en: 'Full physical address of the office or business premises.',
        pages_bm: ['Hubungi Kami', 'Footer'],
        pages_en: ['Contact Us', 'Footer'],
        location_bm: 'Dipaparkan di halaman Hubungi Kami, footer, dan e-mel.',
        location_en: 'Displayed on the Contact Us page, footer, and emails.'
    },
    contact_map_url: {
        desc_bm: 'Pautan URL Google Maps (iframe/embed/share link) lokasi pejabat.',
        desc_en: 'Google Maps URL (iframe/embed/share link) of the office location.',
        pages_bm: ['Hubungi Kami'],
        pages_en: ['Contact Us'],
        location_bm: 'Digunakan untuk memaparkan peta interaktif Google Maps di halaman Hubungi Kami.',
        location_en: 'Used to display the interactive Google Maps embed on the Contact Us page.'
    },
    social_facebook: {
        desc_bm: 'Pautan profil Facebook rasmi syarikat.',
        desc_en: 'Official Facebook profile link.',
        pages_bm: ['Footer'],
        pages_en: ['Footer'],
        location_bm: 'Memautkan ikon Facebook di bahagian footer laman web.',
        location_en: 'Links the Facebook icon in the website footer.'
    },
    social_instagram: {
        desc_bm: 'Pautan profil Instagram rasmi syarikat.',
        desc_en: 'Official Instagram profile link.',
        pages_bm: ['Footer'],
        pages_en: ['Footer'],
        location_bm: 'Memautkan ikon Instagram di bahagian footer laman web.',
        location_en: 'Links the Instagram icon in the website footer.'
    },
    social_linkedin: {
        desc_bm: 'Pautan profil LinkedIn rasmi syarikat.',
        desc_en: 'Official LinkedIn profile link.',
        pages_bm: ['Footer'],
        pages_en: ['Footer'],
        location_bm: 'Memautkan ikon LinkedIn di bahagian footer laman web.',
        location_en: 'Links the LinkedIn icon in the website footer.'
    },
    social_twitter: {
        desc_bm: 'Pautan profil Twitter / X rasmi syarikat.',
        desc_en: 'Official Twitter / X profile link.',
        pages_bm: ['Footer'],
        pages_en: ['Footer'],
        location_bm: 'Memautkan ikon Twitter/X di bahagian footer laman web.',
        location_en: 'Links the Twitter/X icon in the website footer.'
    },
    social_tiktok: {
        desc_bm: 'Pautan profil TikTok rasmi syarikat.',
        desc_en: 'Official TikTok profile link.',
        pages_bm: ['Footer'],
        pages_en: ['Footer'],
        location_bm: 'Memautkan ikon TikTok di bahagian footer laman web.',
        location_en: 'Links the TikTok icon in the website footer.'
    },
    company_about: {
        desc_bm: 'Penerangan ringkas mengenai syarikat.',
        desc_en: 'A brief description about the company.',
        pages_bm: ['Tentang Kami', 'Footer'],
        pages_en: ['About Us', 'Footer'],
        location_bm: 'Dipaparkan di perenggan pengenalan halaman Tentang Kami dan ruangan teks footer.',
        location_en: 'Displayed in the introductory paragraph on the About Us page and the footer text area.'
    },
    company_background: {
        desc_bm: 'Penerangan lengkap latar belakang syarikat.',
        desc_en: 'Full description about the company background.',
        pages_bm: ['Tentang Kami'],
        pages_en: ['About Us'],
        location_bm: 'Dipaparkan sebagai Latar Belakang Syarikat di halaman Tentang Kami (di atas senarai Pasukan Kami).',
        location_en: 'Displayed as Company Background on the About Us page (above Our Team section).'
    },
    company_vision: {
        desc_bm: 'Visi jangka panjang syarikat.',
        desc_en: 'Long-term vision of the company.',
        pages_bm: ['Tentang Kami'],
        pages_en: ['About Us'],
        location_bm: 'Dipaparkan di halaman Tentang Kami pada bahagian Visi & Misi.',
        location_en: 'Displayed on the About Us page under the Vision & Mission section.'
    },
    company_mission: {
        desc_bm: 'Misi dan usaha berterusan syarikat.',
        desc_en: 'Mission and ongoing efforts of the company.',
        pages_bm: ['Tentang Kami'],
        pages_en: ['About Us'],
        location_bm: 'Dipaparkan di halaman Tentang Kami pada bahagian Visi & Misi.',
        location_en: 'Displayed on the About Us page under the Vision & Mission section.'
    },
    company_registration: {
        desc_bm: 'Nombor pendaftaran Suruhanjaya Syarikat Malaysia (SSM).',
        desc_en: 'SSM registration number.',
        pages_bm: ['Footer', 'Tentang Kami'],
        pages_en: ['Footer', 'About Us'],
        location_bm: 'Dipaparkan bersebelahan nama syarikat di bahagian footer.',
        location_en: 'Displayed next to the company name in the footer section.'
    },
    company_journey: {
        desc_bm: 'Perjalanan / mercu tanda sejarah syarikat (milestones).',
        desc_en: 'The milestone timeline of the company.',
        pages_bm: ['Tentang Kami'],
        pages_en: ['About Us'],
        location_bm: 'Format: Tahun | Tajuk BM / Tajuk EN | Huraian BM / Huraian EN (Satu baris setiap mercu tanda).',
        location_en: 'Format: Year | Title BM / Title EN | Description BM / Description EN (One line per milestone).'
    },
    footer_text: {
        desc_bm: 'Teks hak cipta di bahagian paling bawah laman web.',
        desc_en: 'Copyright text at the very bottom of the website.',
        pages_bm: ['Footer'],
        pages_en: ['Footer'],
        location_bm: 'Dipaparkan di bahagian paling bawah (bar hitam kecil) setiap halaman.',
        location_en: 'Displayed at the very bottom (small black bar) of every page.'
    }
};

// Sections structure for general settings
const SECTIONS = [
    {
        id: 'general',
        title: 'Maklumat Laman',
        title_en: 'Site Info',
        icon: Globe,
        desc: 'Tetapan ini dipaparkan di tajuk pelayar, navbar utama, dan data metadata SEO bagi seluruh laman web awam.',
    },
    {
        id: 'contact',
        title: 'Maklumat Hubungan',
        title_en: 'Contact Details',
        icon: Phone,
        desc: 'Dipaparkan di halaman Hubungi Kami, footer laman web, dan ruangan hubungi di bahagian bawah halaman.',
    },
    {
        id: 'social',
        title: 'Media Sosial',
        title_en: 'Social Media',
        icon: Share2,
        desc: 'Pautan ke akaun media sosial rasmi organisasi anda yang dipaparkan dalam bentuk ikon di footer laman web.',
    },
    {
        id: 'company',
        title: 'Maklumat Syarikat',
        title_en: 'Company Details',
        icon: Building2,
        desc: 'Maklumat korporat dan rasmi syarikat yang dipaparkan di halaman Tentang Kami serta maklumat pendaftaran SSM.',
    },
    {
        id: 'footer',
        title: 'Footer Laman',
        title_en: 'Footer Settings',
        icon: FileText,
        desc: 'Teks hak cipta dan pengakuan rasmi syarikat di bahagian paling bawah setiap halaman web.',
    }
];

function SettingFieldCard({ setting, originalValue, originalValueEn, onChange, mirrorEnabled }) {
    const { t, lang } = useTranslation();
    const [val, setVal] = useState(originalValue || '');
    const [valEn, setValEn] = useState(originalValueEn || '');
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState(null);

    const touchedBm = React.useRef(false);
    const touchedEn = React.useRef(false);

    // Sync value changes from parent (e.g. if the parent form resets or changes)
    useEffect(() => {
        setVal(originalValue || '');
        touchedBm.current = false;
    }, [originalValue]);

    useEffect(() => {
        setValEn(originalValueEn || '');
        touchedEn.current = false;
    }, [originalValueEn]);

    const isBilingual = BILINGUAL_KEYS.includes(setting.key);
    const hasChanges = String(val) !== String(setting.value || '') || (isBilingual && String(valEn) !== String(setting.value_en || ''));

    const handleBmChange = (newVal) => {
        touchedBm.current = true;
        setVal(newVal);
        onChange(setting.key, newVal);
        if (mirrorEnabled && isBilingual && !touchedEn.current) {
            setValEn(newVal);
            onChange(setting.key, newVal, true);
        }
    };

    const handleEnChange = (newVal) => {
        touchedEn.current = true;
        setValEn(newVal);
        onChange(setting.key, newVal, true);
        if (mirrorEnabled && isBilingual && !touchedBm.current) {
            setVal(newVal);
            onChange(setting.key, newVal);
        }
    };

    const handleSingleChange = (newVal) => {
        setVal(newVal);
        onChange(setting.key, newVal);
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        
        try {
            const payload = { key: setting.key, value: val };
            if (isBilingual) {
                payload.value_en = valEn;
            }

            await window.axios.post(route('admin.settings.bulk-update'), {
                settings: [payload]
            });

            setSaved(true);
            setTimeout(() => setSaved(false), 1500);
            onChange(setting.key, val); // sync to parent state
            if (isBilingual) {
                onChange(setting.key, valEn, true); // sync to parent state
            }
            router.reload({ only: ['allSettings', 'settings'] });
        } catch (e) {
            const errorMsg = e.response?.data?.message || t('server_error_retry');
            setError(errorMsg);
        } finally {
            setSaving(false);
        }
    };

    const guidance = SETTING_GUIDANCE[setting.key] || {
        desc_bm: 'Tetapan tersuai untuk sistem.',
        desc_en: 'Custom setting for the system.',
        pages_bm: [],
        pages_en: [],
        location_bm: 'Digunakan mengikut keperluan kod templat.',
        location_en: 'Used as needed in template code.'
    };

    const activeLabel = lang === 'en' ? (setting.label_en || setting.label || setting.key) : (setting.label || setting.key);
    const activeDesc = lang === 'en' ? guidance.desc_en : guidance.desc_bm;
    const pagesList = lang === 'en' ? guidance.pages_en : guidance.pages_bm;
    const activeLocation = lang === 'en' ? guidance.location_en : guidance.location_bm;

    const renderInput = (value, onValueChange, placeholder) => {
        if (setting.key === 'company_journey') {
            return (
                <JourneyEditor
                    value={value}
                    onChange={onValueChange}
                />
            );
        }
        if (setting.type === 'richtext' || setting.key === 'company_background') {
            return (
                <RichTextEditor
                    value={value}
                    onChange={onValueChange}
                    placeholder={placeholder}
                />
            );
        }
        if (setting.type === 'textarea') {
            return (
                <textarea
                    className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors resize-y font-sans"
                    rows={3}
                    placeholder={placeholder}
                    value={value}
                    onChange={e => onValueChange(e.target.value)}
                />
            );
        }
        if (setting.type === 'image') {
            return (
                <div className="bg-[#0d0d10] rounded-xl border border-white/10 p-3">
                    <MediaSelectorInput
                        label=""
                        value={value}
                        onChange={onValueChange}
                        collection="general"
                        initialMedia={setting.media || null}
                    />
                </div>
            );
        }
        if (setting.type === 'boolean') {
            return (
                <select
                    className="w-full sm:w-48 bg-[#0d0d10] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors font-sans"
                    value={value}
                    onChange={e => onValueChange(e.target.value)}
                >
                    <option value="1">{t('active_yes')}</option>
                    <option value="0">{t('inactive_no')}</option>
                </select>
            );
        }
        return (
            <input
                type="text"
                className="w-full bg-[#0d0d10] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-colors font-sans"
                placeholder={placeholder}
                value={value}
                onChange={e => onValueChange(e.target.value)}
            />
        );
    };

    const placeholder = t('enter_setting_placeholder', { name: activeLabel });

    return (
        <div className="p-5 bg-[#080808]/50 hover:bg-[#080808]/80 rounded-xl border border-white/5 hover:border-white/10 transition-all space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                        <label className="text-sm font-bold text-white">
                            {activeLabel}
                        </label>
                        <code className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded font-mono">
                            {setting.key}
                        </code>
                    </div>
                    
                    <p className="text-xs text-zinc-400">
                        {activeDesc}
                    </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={!hasChanges || saving || saved}
                        className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all duration-300 font-sans ${
                            saved
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 cursor-default'
                                : hasChanges && !saving
                                    ? 'bg-[var(--gold)] text-[#080808] hover:opacity-90 shadow-lg shadow-[var(--gold)]/10'
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
                        {saving ? t('saving') : saved ? t('saved') : t('save_changes')}
                    </button>
                </div>
            </div>

            {error && (
                <div className="text-xs text-red-400 bg-red-950/20 border border-red-900/20 px-3 py-2 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div className="mt-1">
                {isBilingual ? (
                    <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">Bahasa Melayu (BM)</label>
                            {renderInput(val, handleBmChange, placeholder)}
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-zinc-500 font-bold block uppercase tracking-wider">English (EN)</label>
                            {renderInput(valEn, handleEnChange, placeholder)}
                        </div>
                    </div>
                ) : (
                    renderInput(val, handleSingleChange, placeholder)
                )}
            </div>

            {pagesList && pagesList.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center">
                    {pagesList.map((p, idx) => (
                        <span 
                            key={idx} 
                            className="text-[10px] font-semibold bg-zinc-800/80 text-zinc-300 border border-white/5 px-2 py-0.5 rounded-full"
                        >
                            {p}
                        </span>
                    ))}
                </div>
            )}

            {activeLocation && (
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 bg-zinc-950/40 px-3 py-1.5 rounded-lg border border-white/[0.02]">
                    <Eye className="w-3.5 h-3.5 text-[var(--gold)] flex-shrink-0" />
                    <span>
                        <strong className="text-zinc-400 font-sans">{t('display_location')}: </strong> 
                        {activeLocation}
                    </span>
                </div>
            )}
        </div>
    );
}

function SettingSectionCard({ section, settings, formValues, onChange, mirrorEnabled }) {
    const { t, lang } = useTranslation();
    const SectionIcon = section.icon;

    return (
        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 bg-[#0e0e11] flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-[var(--gold)]/10 text-[var(--gold)] rounded-xl border border-[var(--gold)]/20 mt-0.5">
                        <SectionIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {lang === 'en' ? section.title_en : section.title}
                        </h3>
                        <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                            {lang === 'en' ? section.desc_en : section.desc}
                        </p>
                    </div>
                </div>
            </div>

            {/* Fields List */}
            <div className="p-6 space-y-6">
                {settings.length === 0 ? (
                    <p className="text-zinc-500 text-sm text-center py-6">{t('no_settings_in_group')}</p>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {settings.map(setting => {
                            const originalValue = formValues[setting.key] !== undefined ? formValues[setting.key] : (setting.value || '');
                            const originalValueEn = formValues[setting.key + '_en'] !== undefined ? formValues[setting.key + '_en'] : (setting.value_en || '');
                            return (
                                <SettingFieldCard
                                    key={setting.id}
                                    setting={setting}
                                    originalValue={originalValue}
                                    originalValueEn={originalValueEn}
                                    onChange={onChange}
                                    mirrorEnabled={mirrorEnabled}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function Index({ settings, allSettings = [], filters }) {
    const { t, lang } = useTranslation();
    const [search, setSearch] = useState(filters.search || '');
    const [groupFilter, setGroupFilter] = useState(filters.group || '');

    const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
    const [activeSectionId, setActiveSectionId] = useState('general');
    const [formValues, setFormValues] = useState({});
    
    const [mirrorEnabled, setMirrorEnabled] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mirror_enabled') !== 'false' : true));

    const handleMirrorToggle = (checked) => {
        setMirrorEnabled(checked);
        localStorage.setItem('mirror_enabled', checked ? 'true' : 'false');
    };

    // Populate bulk editor form values
    useEffect(() => {
        if (allSettings) {
            const vals = {};
            allSettings.forEach(s => {
                vals[s.key] = s.value || '';
                vals[s.key + '_en'] = s.value_en || '';
            });
            setFormValues(vals);
        }
    }, [allSettings]);

    const handleFieldChange = (key, value, isEn = false) => {
        setFormValues(prev => ({
            ...prev,
            [isEn ? key + '_en' : key]: value
        }));
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
        if (confirm(t('delete_setting_confirm'))) {
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

    // Construct active visual sections list
    const activeSections = [...SECTIONS];
    const fallbackSettings = allSettings.filter(s => !['general', 'contact', 'social', 'company', 'footer'].includes(s.group));
    if (fallbackSettings.length > 0) {
        activeSections.push({
            id: 'others',
            title: 'Tetapan Lain',
            title_en: 'Other Settings',
            icon: Settings,
            desc: 'Tetapan tambahan atau tersuai yang tidak dikategorikan dalam kumpulan utama.',
            desc_en: 'Additional or custom settings that are not categorized in the main groups.',
        });
    }

    return (
        <AdminLayout header={t('general_settings')}>
            <Head title={`${t('general_settings')} | Admin`} />

            <div className="space-y-6">
                {/* Penterjemahan Pintar (Auto-Fill Toggle) */}
                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                    <div className="p-4 px-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <label htmlFor="mirror_enabled" className="text-sm font-medium text-zinc-300 block font-semibold">
                                    {t('auto_copy')}
                                </label>
                                <span className="text-xs text-zinc-500 block mt-0.5">{t('auto_copy_desc')}</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer select-none">
                                <input
                                    id="mirror_enabled"
                                    type="checkbox"
                                    checked={mirrorEnabled}
                                    onChange={e => handleMirrorToggle(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="switch-toggle-track toggle-gold"></div>
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tab Selector */}
                <div className="w-full lg:w-64 flex-shrink-0 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-3 lg:pb-0 border-b lg:border-b-0 lg:border-r border-white/5 pr-0 lg:pr-6 scrollbar-none">
                    {activeSections.map(section => {
                        const sectionSettings = allSettings.filter(s => 
                            section.id === 'others' 
                                ? !['general', 'contact', 'social', 'company', 'footer'].includes(s.group)
                                : s.group === section.id
                        );
                        
                        const hasChanges = sectionSettings.some(s => {
                            const currentVal = formValues[s.key];
                            const originalVal = s.value || '';
                            const currentValEn = formValues[s.key + '_en'];
                            const originalValEn = s.value_en || '';
                            return String(currentVal) !== String(originalVal) || String(currentValEn) !== String(originalValEn);
                        });

                        const SectionIcon = section.icon;
                        const isActive = activeSectionId === section.id;

                        return (
                            <button
                                key={section.id}
                                type="button"
                                onClick={() => setActiveSectionId(section.id)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all w-full min-w-[180px] sm:min-w-[200px] lg:min-w-0 border ${
                                    isActive
                                        ? 'bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)] font-bold'
                                        : 'bg-transparent border-transparent text-zinc-400 hover:text-white hover:bg-white/[0.02]'
                                }`}
                            >
                                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[var(--gold)]/25 text-[var(--gold)]' : 'bg-zinc-900 text-zinc-400'}`}>
                                    <SectionIcon className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm truncate flex items-center justify-between gap-1">
                                        <span>{lang === 'en' ? section.title_en : section.title}</span>
                                        {hasChanges && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-[var(--gold)] animate-pulse" title={t('unsaved_changes_desc')} />
                                        )}
                                    </div>
                                    <p className="text-[10px] text-zinc-500 truncate mt-0.5 font-normal">{lang === 'en' ? section.title_en : section.title}</p>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Section Card Editor */}
                <div className="flex-1">
                    {(() => {
                        const section = activeSections.find(s => s.id === activeSectionId);
                        if (!section) return null;

                        const sectionSettings = allSettings.filter(s => 
                            section.id === 'others' 
                                ? !['general', 'contact', 'social', 'company', 'footer'].includes(s.group)
                                : s.group === section.id
                        );

                        return (
                            <SettingSectionCard
                                key={section.id}
                                section={section}
                                settings={sectionSettings}
                                formValues={formValues}
                                onChange={handleFieldChange}
                                mirrorEnabled={mirrorEnabled}
                            />
                        );
                    })()}
                </div>
            </div>
            </div>
        </AdminLayout>
    );
}
