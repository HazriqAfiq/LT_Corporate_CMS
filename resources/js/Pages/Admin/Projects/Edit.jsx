import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import useTranslation from '@/Hooks/useTranslation';
import { ArrowLeft, Save, Trash, Check } from 'lucide-react';
import RichTextEditor from '@/Components/Admin/RichTextEditor';
import MediaSelectorInput from '@/Components/Media/MediaSelectorInput';
import UnifiedImageManager from '@/Components/Media/UnifiedImageManager';
import DeleteConfirmModal from '@/Components/Admin/DeleteConfirmModal';
import UnsavedChangesModal from '@/Components/Admin/UnsavedChangesModal';
import ToggleSwitch from '@/Components/Admin/ToggleSwitch';

export default function Edit({ project, galleryMedia = [] }) {
    const { t } = useTranslation();
    const { data, setData, processing, errors, setError, clearErrors, isDirty } = useForm({
        _method: 'PUT',
        title: project.title || '',
        title_en: project.title_en || '',
        client: project.client || '',
        category: project.category || '',
        url: project.url || '',
        description: project.description || '',
        description_en: project.description_en || '',
        content: project.content || '',
        content_en: project.content_en || '',
        testimonial: project.testimonial || '',
        testimonial_en: project.testimonial_en || '',
        testimonial_author: project.testimonial_author || '',
        is_published: !!project.is_published,
        is_featured: !!project.is_featured,
        completed_at: project.completed_at ? project.completed_at.slice(0, 10) : '',
        featured_media_id: project.featured_media_id || null,
        gallery_media_ids: Array.isArray(project.gallery_media_ids) ? project.gallery_media_ids : [],
        technologies: project.technologies || [],
    });

    const [showUnsavedModal, setShowUnsavedModal] = React.useState(false);
    const [pendingNavUrl, setPendingNavUrl] = React.useState(null);

    const handleBackNav = (e) => {
        e.preventDefault();
        if (isDirty) {
            setPendingNavUrl(route('admin.projects.index'));
            setShowUnsavedModal(true);
        } else {
            router.visit(route('admin.projects.index'));
        }
    };

    const handleNavDiscard = () => {
        setShowUnsavedModal(false);
        router.visit(pendingNavUrl || route('admin.projects.index'));
    };


    const [showTick, setShowTick] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const touched = React.useRef({
        title: !!project.title,
        title_en: !!project.title_en,
        description: !!project.description,
        description_en: !!project.description_en,
        content: !!project.content,
        content_en: !!project.content_en,
        testimonial: !!project.testimonial,
        testimonial_en: !!project.testimonial_en,
    });

    const [mirrorEnabled, setMirrorEnabled] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mirror_enabled') !== 'false' : true));

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
        window.axios.post(route('admin.projects.update', project.id), data)
            .then(() => {
                setShowTick(true);
                setTimeout(() => {
                    setShowTick(false);
                    router.visit(route('admin.projects.index'));
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
        router.delete(route('admin.projects.destroy', project.id), {
            onSuccess: () => setShowDeleteModal(false)
        });
    };

    return (
        <AdminLayout header={t('edit_project')}>
            <Head title={`${t('edit_project')} ${project.title} | Admin`} />

            <div className="mx-auto">
                <div className="mb-6 flex justify-between items-center">
                    <button type="button" onClick={handleBackNav} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        {t('back_to_project_list')}
                    </button>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('project_info')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('project_info_desc')}</p>
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

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('client')}</label>
                                        <input
                                            type="text"
                                            value={data.client}
                                            onChange={e => setData('client', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        />
                                        {errors.client && <p className="mt-1 text-sm text-red-600">{errors.client}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('category')}</label>
                                        <select
                                            value={data.category}
                                            onChange={e => setData('category', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        >
                                            <option value="">{t('select_category')}</option>
                                            <option value="web">Pembangunan Web</option>
                                            <option value="mobile">Aplikasi Mudah Alih</option>
                                            <option value="system">Sistem</option>
                                            <option value="design">Rekabentuk UI/UX</option>
                                            <option value="cloud">Cloud & Hosting</option>
                                            <option value="ai">AI & Automasi</option>
                                        </select>
                                        {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('project_url')}</label>
                                        <input
                                            type="url"
                                            value={data.url}
                                            onChange={e => setData('url', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder="https://..."
                                        />
                                        {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('short_desc_bm')}</label>
                                    <textarea
                                        rows="2"
                                        value={data.description}
                                        onChange={e => handleBilingualChange('description', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Ringkasan ringkas projek..."
                                    ></textarea>
                                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('short_desc_en')}</label>
                                    <textarea
                                        rows="2"
                                        value={data.description_en}
                                        onChange={e => handleBilingualChange('description_en', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder="Brief project summary..."
                                    ></textarea>
                                    {errors.description_en && <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>}
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
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('full_content_bm')}</label>
                                    <RichTextEditor
                                        value={data.content}
                                        onChange={c => handleBilingualChange('content', c)}
                                        collection="projects"
                                    />
                                    {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
                                </div>

                                <div className="pt-6 border-t border-white/5">
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">{t('full_content_en')}</label>
                                    <RichTextEditor
                                        value={data.content_en}
                                        onChange={c => handleBilingualChange('content_en', c)}
                                        collection="projects"
                                    />
                                    {errors.content_en && <p className="mt-2 text-sm text-red-600">{errors.content_en}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Testimonial Section */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('client_testimonial')}</h2>
                                <p className="text-sm text-zinc-500 mt-1">{t('client_testimonial_desc')}</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('testimonial_author')}</label>
                                    <input
                                        type="text"
                                        value={data.testimonial_author}
                                        onChange={e => setData('testimonial_author', e.target.value)}
                                        className="w-full md:w-1/2 rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                        placeholder={t('testimonial_author_placeholder')}
                                    />
                                    {errors.testimonial_author && <p className="mt-1 text-sm text-red-600">{errors.testimonial_author}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('testimonial_bm')}</label>
                                        <textarea
                                            rows="3"
                                            value={data.testimonial}
                                            onChange={e => handleBilingualChange('testimonial', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder={t('testimonial_bm_placeholder')}
                                        ></textarea>
                                        {errors.testimonial && <p className="mt-1 text-sm text-red-600">{errors.testimonial}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-zinc-300 mb-1">{t('testimonial_en')}</label>
                                        <textarea
                                            rows="3"
                                            value={data.testimonial_en}
                                            onChange={e => handleBilingualChange('testimonial_en', e.target.value)}
                                            className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                            placeholder={t('testimonial_en_placeholder')}
                                        ></textarea>
                                        {errors.testimonial_en && <p className="mt-1 text-sm text-red-600">{errors.testimonial_en}</p>}
                                    </div>
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
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('status_settings')}</h2>
                            </div>
                            <div className="p-4 space-y-4">
                                
                                <ToggleSwitch
                                    id="is_published"
                                    checked={data.is_published}
                                    onChange={checked => setData('is_published', checked)}
                                    label={t('published')}
                                />

                                <ToggleSwitch
                                    id="is_featured"
                                    checked={data.is_featured}
                                    onChange={checked => setData('is_featured', checked)}
                                    label={t('featured_option')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1">{t('completion_date')}</label>
                                    <input
                                        type="date"
                                        value={data.completed_at}
                                        onChange={e => setData('completed_at', e.target.value)}
                                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)]"
                                    />
                                    {errors.completed_at && <p className="mt-1 text-sm text-red-600">{errors.completed_at}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5">
                                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{t('media_images')}</h2>
                            </div>
                            <div className="p-4 space-y-6">
                                
                                {/* Unified Image Management */}
                                <div>
                                    <UnifiedImageManager
                                        label={t('project_images_label')}
                                        description={t('project_images_desc')}
                                        value={data.gallery_media_ids}
                                        featuredId={data.featured_media_id}
                                        onChange={val => setData('gallery_media_ids', val)}
                                        onFeaturedChange={val => setData('featured_media_id', val)}
                                        collection="projects"
                                        initialMedia={galleryMedia}
                                        error={errors.gallery_media_ids}
                                    />
                                </div>
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
                            {t('delete_project')}
                        </button>
                    </div>
                    <div className="flex gap-3">
                        <button type="button" onClick={handleBackNav} className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
                            {t('cancel')}
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            disabled={!isDirty || loading || showTick || !data.title?.trim() || !data.client?.trim() || !data.category?.trim() || !data.description?.trim() || !data.content?.trim() || !data.completed_at?.trim()}
                            className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                                showTick
                                    ? 'btn-submit-success'
                                    : isDirty && !loading && data.title?.trim() && data.client?.trim() && data.category?.trim() && data.description?.trim() && data.content?.trim() && data.completed_at?.trim()
                                        ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                        : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                            }`}
                        >
                            {showTick ? (
                                <>
                                    <Check className="h-4 w-4 mr-2 animate-bounce text-black" strokeWidth={3} />
                                    {t('saved_successfully')}
                                </>
                            ) : loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                                    {t('saving')}
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    {t('save_changes')}
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
                url={route('admin.projects.destroy', project.id)}
                redirectUrl={route('admin.projects.index')}
                title={t('delete_project_confirm_title')}
                message={t('delete_project_confirm_message')}
            />
            <UnsavedChangesModal
                show={showUnsavedModal}
                onClose={() => setShowUnsavedModal(false)}
                onDiscard={handleNavDiscard}
                processing={processing}
            />

        </AdminLayout>
    );
}

