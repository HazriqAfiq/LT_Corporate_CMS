import React from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Trash, File, FileText, Video, Image as ImageIcon } from 'lucide-react';
import useTranslation from '@/Hooks/useTranslation';

export default function Edit({ media }) {
    const { t, lang } = useTranslation();

    const { data, setData, put, processing, errors } = useForm({
        title: media.title || '',
        alt_text: media.alt_text || '',
        collection: media.collection || 'default',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('admin.media.update', media.id));
    };

    const handleDelete = () => {
        if (confirm(t('delete_media_confirm_message'))) {
            router.delete(route('admin.media.destroy', media.id));
        }
    };

    const getFileIcon = (mimeType) => {
        if (!mimeType) return <File className="w-16 h-16 text-zinc-600" />;
        if (mimeType.startsWith('image/')) return <ImageIcon className="w-16 h-16 text-[var(--gold)]" />;
        if (mimeType.startsWith('video/')) return <Video className="w-16 h-16 text-purple-400" />;
        if (mimeType === 'application/pdf') return <FileText className="w-16 h-16 text-red-400" />;
        return <File className="w-16 h-16 text-zinc-600" />;
    };

    const formatBytes = (bytes, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <AdminLayout header={t('edit_media')}>
            <Head title={`${t('edit_media_title_dynamic', { filename: media.original_filename })} | Admin`} />

            <div className="max-w-4xl mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <Link href={route('admin.media.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        {t('back_to_media_library')}
                    </Link>
                </div>

                <form onSubmit={submit} className="flex flex-col md:flex-row gap-6">
                    
                    {/* Left Column (File Preview) */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                                <h2 className="text-base font-bold text-white">{t('file_preview')}</h2>
                                <a 
                                    href={`/storage/${media.path}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-sm text-[var(--gold)] dark:text-[var(--gold)] hover:underline"
                                >
                                    {t('open_in_new_tab')}
                                </a>
                            </div>
                            <div className="p-6">
                                <div className="border border-white/5 rounded-lg p-6 flex flex-col items-center justify-center bg-[#080808] dark:bg-[#080808]/50 min-h-[300px]">
                                    {media.mime_type?.startsWith('image/') ? (
                                        <img src={`/storage/${media.path}`} alt={media.alt_text || media.title || media.original_filename} className="max-h-80 object-contain rounded-md  mb-6" />
                                    ) : media.mime_type?.startsWith('video/') ? (
                                        <video src={`/storage/${media.path}`} controls className="max-h-80 object-contain rounded-md  mb-6" />
                                    ) : (
                                        <div className="mb-6">
                                            {getFileIcon(media.mime_type)}
                                        </div>
                                    )}

                                    <div className="text-center w-full max-w-md bg-white dark:bg-gray-800 p-4 rounded-md  border border-white/5">
                                        <p className="text-sm font-semibold text-white truncate" title={media.original_filename}>{media.original_filename}</p>
                                        <div className="flex justify-center gap-4 mt-2 text-xs text-zinc-500 font-mono">
                                            <span>{formatBytes(media.size)}</span>
                                            <span>•</span>
                                            <span>{media.mime_type || t('unknown_type')}</span>
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-white/5 text-xs text-zinc-500">
                                            {t('uploaded_at')}: {new Date(media.created_at).toLocaleDateString(lang === 'en' ? 'en-US' : 'ms-MY', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Metadata) */}
                    <div className="w-full md:w-96 space-y-6 flex-shrink-0">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('media_info')}</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('collection_folder')}</label>
                                    <select
                                        value={data.collection}
                                        onChange={e => setData('collection', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    >
                                        <option value="default">{t('media_collection_default')}</option>
                                        <option value="sliders">{t('media_collection_sliders')}</option>
                                        <option value="articles">{t('media_collection_articles')}</option>
                                        <option value="products">{t('media_collection_products')}</option>
                                        <option value="projects">{t('media_collection_portfolio')}</option>
                                    </select>
                                    {errors.collection && <p className="mt-1 text-xs text-red-600">{errors.collection}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('custom_title')}</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={e => setData('title', e.target.value)}
                                        placeholder={t('custom_title_placeholder')}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('alt_text_seo')}</label>
                                    <input
                                        type="text"
                                        value={data.alt_text}
                                        onChange={e => setData('alt_text', e.target.value)}
                                        placeholder={t('short_image_desc_placeholder')}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.alt_text && <p className="mt-1 text-xs text-red-600">{errors.alt_text}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('file_url')}</label>
                                    <div className="flex mt-1">
                                        <input
                                            type="text"
                                            value={`${window.location.origin}/storage/${media.path}`}
                                            readOnly
                                            className="w-full rounded-l-md border border-white/10 bg-[#0c0c0e] text-zinc-500 px-3 py-2 text-xs font-mono"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/storage/${media.path}`);
                                                alert(t('link_copied'));
                                            }}
                                            className="inline-flex items-center px-3 py-2 border border-l-0 border-white/10 rounded-r-md bg-[#080808] dark:bg-gray-700 text-zinc-300 hover:bg-gray-200 dark:hover:bg-gray-600 text-sm font-medium transition-colors"
                                        >
                                            {t('copy_url').split(' ')[0]}
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>

                </form>

                {/* Fixed Bottom Save/Cancel/Delete Actions Bar */}
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <div>
                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center px-4 py-2 border border-red-500/20 rounded-lg text-sm font-bold text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <Trash className="h-4 w-4 mr-2" />
                            {t('delete_media')}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <Link
                            href={route('admin.media.index')}
                            className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                        >
                            {t('cancel')}
                        </Link>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={processing}
                            className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] disabled:opacity-50"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? t('saving') : t('save_changes')}
                        </button>
                    </div>
                </div>

            </div>

            <div className="h-24"></div>

        </AdminLayout>
    );
}
