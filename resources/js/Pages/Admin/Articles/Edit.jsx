import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, Trash, Check } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
import ToggleSwitch from '@/Components/Admin/ToggleSwitch';

export default function Edit({ article }) {
    const { t } = useTranslation();
    const getLocalNowString = () => {
        const now = new Date();
        const offset = now.getTimezoneOffset();
        const localNow = new Date(now.getTime() - offset * 60 * 1000);
        return localNow.toISOString().slice(0, 16);
    };

    const parseUtcDate = (dateString) => {
        if (!dateString) return null;
        let str = dateString;
        if (str.includes(' ') && !str.includes('T')) {
            str = str.replace(' ', 'T');
        }
        if (!str.endsWith('Z') && !/[+-]\d{2}:?\d{2}$/.test(str)) {
            str += 'Z';
        }
        const d = new Date(str);
        return isNaN(d.getTime()) ? null : d;
    };

    const toLocalInputValue = (dateString) => {
        const date = parseUtcDate(dateString);
        if (!date) return '';
        const offset = date.getTimezoneOffset();
        const localDate = new Date(date.getTime() - offset * 60 * 1000);
        return localDate.toISOString().slice(0, 16);
    };

    const toUtcString = (localInputValue) => {
        if (!localInputValue) return null;
        const date = new Date(localInputValue);
        if (isNaN(date.getTime())) return null;
        return date.toISOString();
    };

    const isPosted = (article.is_published || article.is_archived) && article.published_at && new Date(article.published_at) <= new Date();
    const isFutureScheduled = article.published_at && new Date(article.published_at) > new Date();
    const isCurrentlyDraft = !article.is_published && !article.is_archived;

    const { data, setData, processing, errors, setError, clearErrors, isDirty, transform } = useForm({
        _method: 'PUT',
        title: article.title || '',
        title_en: article.title_en || '',
        category: article.category || '',
        excerpt: article.excerpt || '',
        excerpt_en: article.excerpt_en || '',
        content: article.content || '',
        content_en: article.content_en || '',
        is_published: !!article.is_published,
        is_archived: !!article.is_archived,
        publish_immediately: !isFutureScheduled,
        published_at: toLocalInputValue(article.published_at),
        meta_title: article.meta_title || '',
        meta_description: article.meta_description || '',
        featured_media_id: article.featured_media_id || null,
    });

    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUnsavedModal, setShowUnsavedModal] = useState(false);
    const [pendingNavUrl, setPendingNavUrl] = useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.articles.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.articles.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        setTimeout(() => {
            router.visit(pendingNavUrl || route('admin.articles.index'));
        }, 200);
    };

    const handleSaveDraft = () => {
        setLoading(true);
        clearErrors();

        const payload = {
            ...data,
            _method: 'PUT',
            is_published: false,
            publish_immediately: false,
            published_at: null,
        };

        return window.axios.post(route('admin.articles.update', article.id), payload)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    setShowUnsavedModal(false);
                    setTimeout(() => {
                        router.visit(route('admin.articles.index'));
                    }, 200);
                }, 1500);
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 422) {
                    const validationErrors = err.response.data.errors;
                    const formattedErrors = {};
                    Object.keys(validationErrors).forEach(key => {
                        formattedErrors[key] = validationErrors[key][0];
                    });
                    setError(formattedErrors);
                } else {
                    alert('Gagal menyimpan draf.');
                }
                throw err;
            });
    };

    const touched = React.useRef({
        title: !!article.title,
        title_en: !!article.title_en,
        excerpt: !!article.excerpt,
        excerpt_en: !!article.excerpt_en,
        content: !!article.content,
        content_en: !!article.content_en,
    });

    const [mirrorEnabled, setMirrorEnabled] = React.useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mirror_enabled') !== 'false' : true));

    const [minDateTime, setMinDateTime] = React.useState(getLocalNowString());

    React.useEffect(() => {
        const updateMin = () => {
            const nowStr = getLocalNowString();
            setMinDateTime(nowStr);
            setData(prev => {
                if (!isPosted && !prev.publish_immediately) {
                    if (!prev.published_at || new Date(prev.published_at) <= new Date()) {
                        return { ...prev, published_at: nowStr };
                    }
                }
                return prev;
            });
        };
        updateMin();
        const interval = setInterval(updateMin, 10000);
        return () => clearInterval(interval);
    }, [isPosted]);

    const handleMirrorToggle = (checked) => {
        setMirrorEnabled(checked);
        localStorage.setItem('mirror_enabled', checked ? 'true' : 'false');
    };

    const handleBilingualChange = (field, val) => {
        touched.current[field] = true;
        const isEn = field.endsWith('_en');
        const counterpart = isEn ? field.slice(0, -3) : `${field}_en`;
        
        if (mirrorEnabled && !touched.current[counterpart]) {
            setData(prev => ({
                ...prev,
                [field]: val,
                [counterpart]: val
            }));
        } else {
            setData(field, val);
        }
    };

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        clearErrors();

        let finalPublishImmediately = data.publish_immediately;
        let finalPublishedAt = data.published_at;

        // If in scheduled mode, check if we need to fall back to publish immediately
        if (!isPosted && !finalPublishImmediately) {
            if (!finalPublishedAt || new Date(finalPublishedAt) <= new Date()) {
                finalPublishImmediately = true;
                finalPublishedAt = null;
            }
        }

        const payload = {
            ...data,
            _method: 'PUT',
            is_published: isCurrentlyDraft ? true : data.is_published,
            publish_immediately: finalPublishImmediately,
            published_at: isPosted
                ? toUtcString(data.published_at)
                : (finalPublishImmediately ? null : toUtcString(finalPublishedAt)),
        };

        window.axios.post(route('admin.articles.update', article.id), payload)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.articles.index'));
                }, 1500);
            })
            .catch(err => {
                setLoading(false);
                if (err.response && err.response.status === 422) {
                    const validationErrors = err.response.data.errors;
                    const formattedErrors = {};
                    Object.keys(validationErrors).forEach(key => {
                        formattedErrors[key] = validationErrors[key][0];
                    });
                    setError(formattedErrors);
                } else {
                    alert('Gagal menyimpan maklumat.');
                }
            });
    };

    const handleDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        router.delete(route('admin.articles.destroy', article.id), {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    return (
        <AdminLayout header={t('edit_article')}>
            <Head title={`${t('edit_article')} ${article.title} | Admin`} />

            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button
                        type="button"
                        onClick={handleBackNav}
                        className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        {t('back_to_article_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('article_info')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('article_info_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('title_bm')} *</label>
                                        <input
                                            type="text"
                                            value={data.title}
                                            onChange={e => handleBilingualChange('title', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            required
                                        />
                                        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('title_en')}</label>
                                        <input
                                            type="text"
                                            value={data.title_en}
                                            onChange={e => handleBilingualChange('title_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                        {errors.title_en && <p className="mt-1 text-sm text-red-600">{errors.title_en}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('category')}</label>
                                    <select
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    >
                                        <option value="">{t('select_category')}</option>
                                        <option value="berita">{typeof window !== 'undefined' && localStorage.getItem('lang') === 'en' ? 'News' : 'Berita'}</option>
                                        <option value="teknologi">{typeof window !== 'undefined' && localStorage.getItem('lang') === 'en' ? 'Technology' : 'Teknologi'}</option>
                                        <option value="tips">{typeof window !== 'undefined' && localStorage.getItem('lang') === 'en' ? 'Tips & Tutorials' : 'Tips & Tutorial'}</option>
                                        <option value="pengumuman">{typeof window !== 'undefined' && localStorage.getItem('lang') === 'en' ? 'Announcements' : 'Pengumuman'}</option>
                                        <option value="kajian-kes">{typeof window !== 'undefined' && localStorage.getItem('lang') === 'en' ? 'Case Studies' : 'Kajian Kes'}</option>
                                    </select>
                                    {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('excerpt_bm')}</label>
                                        <textarea
                                            rows="3"
                                            value={data.excerpt}
                                            onChange={e => handleBilingualChange('excerpt', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="Ringkasan ringkas artikel..."
                                        ></textarea>
                                        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('excerpt_en')}</label>
                                        <textarea
                                            rows="3"
                                            value={data.excerpt_en}
                                            onChange={e => handleBilingualChange('excerpt_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="Brief article summary..."
                                        ></textarea>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('main_content')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('main_content_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('content_bm')}</label>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={content => handleBilingualChange('content', content)}
                                    />
                                    {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('content_en')}</label>
                                    <RichTextEditor
                                        value={data.content_en}
                                        onChange={content => handleBilingualChange('content_en', content)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('seo_settings')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">Konfigurasi carian untuk Google dan perkongsian media sosial. / Search configuration for Google and social media sharing.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('meta_title')} <span className="text-xs text-zinc-500 font-normal">(Pilihan / Optional)</span></label>
                                    <input
                                        type="text"
                                        value={data.meta_title}
                                        onChange={e => setData('meta_title', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Tajuk SEO..."
                                    />
                                    <p className="text-[11px] text-zinc-500 mt-1">Biarkan kosong untuk menggunakan tajuk artikel secara automatik. / Leave empty to automatically use the article title.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('meta_description')} <span className="text-xs text-zinc-500 font-normal">(Pilihan / Optional)</span></label>
                                    <textarea
                                        rows="2"
                                        value={data.meta_description}
                                        onChange={e => setData('meta_description', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Penerangan SEO..."
                                    ></textarea>
                                    <p className="text-[11px] text-zinc-500 mt-1">Biarkan kosong untuk menggunakan ringkasan/excerpt artikel secara automatik. / Leave empty to automatically use the article excerpt.</p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Right Column (Sidebar Settings) */}
                    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                        
                        {/* Penterjemahan Pintar (Auto-Fill Toggle) */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('smart_translate')}</h2>
                            </div>
                            <div className="p-4">
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

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('publish_status')}</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                {isPosted ? (
                                    <ToggleSwitch
                                        id="is_archived"
                                        checked={data.is_archived}
                                        onChange={checked => {
                                            setData(prev => ({
                                                ...prev,
                                                is_archived: checked,
                                                is_published: !checked
                                            }));
                                        }}
                                        label={t('archive')}
                                    />
                                ) : (
                                    <div className="flex bg-[#080808] p-1 rounded-xl border border-white/10 w-full">
                                        <button
                                            type="button"
                                            onClick={() => setData('publish_immediately', true)}
                                            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all duration-200 ${
                                                data.publish_immediately
                                                    ? 'bg-[var(--gold)] text-[#080808] shadow-sm'
                                                    : 'text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            {t('publish_immediately')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setData('publish_immediately', false)}
                                            className={`flex-1 py-2 text-center rounded-lg text-xs font-bold transition-all duration-200 ${
                                                !data.publish_immediately
                                                    ? 'bg-[var(--gold)] text-[#080808] shadow-sm'
                                                    : 'text-zinc-400 hover:text-white'
                                            }`}
                                        >
                                            {t('scheduled')}
                                        </button>
                                    </div>
                                )}

                                {(!isPosted && !data.publish_immediately) && (
                                    <div className="space-y-1">
                                        <label className="block text-sm font-medium text-zinc-300">{t('publish_date_schedule')}</label>
                                        <input
                                            type="datetime-local"
                                            value={data.published_at}
                                            min={minDateTime}
                                            onChange={e => setData('published_at', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                    </div>
                                )}

                                {isPosted && (
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('publish_date_schedule')}</label>
                                        <input
                                            type="datetime-local"
                                            value={data.published_at}
                                            disabled={true}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-zinc-500 px-3 py-2 text-sm cursor-not-allowed opacity-50"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4">
                                <MediaSelectorInput
                                    label={t('main_article_image')}
                                    value={data.featured_media_id}
                                    onChange={val => setData('featured_media_id', val)}
                                    collection="articles"
                                    initialMedia={article.featured_media || null}
                                    error={errors.featured_media_id}
                                />
                            </div>
                        </div>

                    </div>

                </form>

                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete_article')}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleBackNav}
                            className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                        >
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={((!isCurrentlyDraft && !isDirty) || processing || showTick || !data.featured_media_id || !data.title?.trim() || !data.category?.trim() || !data.excerpt?.trim() || !data.content?.trim())}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                                showTick
                                    ? 'btn-submit-success'
                                    : (((isCurrentlyDraft || (isDirty && !processing)) && data.featured_media_id && data.title?.trim() && data.category?.trim() && data.excerpt?.trim() && data.content?.trim()))
                                        ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                            }`}
                        >
                            {showTick ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 animate-bounce text-black" strokeWidth={3} />
                                    {isCurrentlyDraft ? t('published_successfully') : t('saved_successfully')}
                                </>
                            ) : processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                                    {t('saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {isCurrentlyDraft ? t('save_article') : t('save_changes')}
                                </>
                            )}
                        </button>
                    </div>
                </div>

            </div>
            
            <div className="h-24"></div>

            <DeleteConfirmModal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                url={route('admin.articles.destroy', article.id)}
                redirectUrl={route('admin.articles.index')}
                title={t('delete_article_confirm_title')}
                message={t('delete_article_confirm_message')}
            />

            <UnsavedChangesModal
                show={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onDiscard={handleNavDiscard}
                onSaveDraft={isCurrentlyDraft ? handleSaveDraft : null}
                processing={processing}
            />

        </AdminLayout>
    );
}
