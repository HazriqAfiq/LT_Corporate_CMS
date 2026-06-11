import React, { useCallback, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, UploadCloud, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import useTranslation from '@/Hooks/useTranslation';
import axios from 'axios';

function formatBytes(bytes) {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function Create({ collections = [] }) {
    const { t } = useTranslation();
    const { csrf_token } = usePage().props;

    const [files, setFiles] = useState([]); // [{ file, preview, progress, status, error }]
    const [title, setTitle] = useState('');
    const [uploading, setUploading] = useState(false);
    const [allDone, setAllDone] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        const newItems = acceptedFiles.map(file => ({
            file,
            preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
            progress: 0,
            status: 'pending', // pending | uploading | done | error
            error: null,
        }));
        setFiles(prev => [...prev, ...newItems].slice(0, 20)); // cap at 20
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
            'application/pdf': ['.pdf'],
            'video/*': ['.mp4', '.webm'],
        },
        maxSize: 10 * 1024 * 1024,
        multiple: true,
    });

    const removeFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));

    const uploadAll = async () => {
        if (!files.length) return;
        setUploading(true);
        setAllDone(false);

        // Mark all as uploading
        setFiles(prev => prev.map(f => ({ ...f, status: 'uploading', progress: 0 })));

        const formData = new FormData();
        files.forEach(item => formData.append('files[]', item.file));
        if (title.trim()) {
            formData.append('title', title.trim());
        }

        try {
            await axios.post(route('admin.media.store'), formData, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token || '',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    // Do NOT set Content-Type; let browser set multipart/form-data with boundary
                },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setFiles(prev => prev.map(f => ({ ...f, progress: pct })));
                    }
                },
            });

            setFiles(prev => prev.map(f => ({ ...f, status: 'done', progress: 100 })));
            setAllDone(true);
            setTimeout(() => router.visit(route('admin.media.index')), 1200);
        } catch (err) {
            let errMsg = t('upload_failed');
            try {
                const data = err.response?.data;
                if (data?.errors) {
                    const firstErrKey = Object.keys(data.errors)[0];
                    errMsg = data.errors[firstErrKey][0];
                } else if (data?.message) {
                    errMsg = data.message;
                }
            } catch (e) {}
            setFiles(prev => prev.map(f => ({ ...f, status: 'error', error: errMsg })));
        } finally {
            setUploading(false);
        }
    };

    return (
        <AdminLayout header={t('upload_media')}>
            <Head title={`${t('upload_media')} | Admin`} />

            <div className="mx-auto space-y-6">
                <Link href={route('admin.media.index')} className="inline-flex items-center text-zinc-500 hover:text-[var(--gold)] text-sm transition-colors gap-1">
                    <ArrowLeft className="w-4 h-4" /> {t('back_to_media_library')}
                </Link>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left — Drop zone + file queue */}
                    <div className="flex-1 space-y-4">
                        {/* Drop zone */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-6 py-4 border-b border-white/5">
                                <h2 className="text-base font-bold text-white">{t('select_files')}</h2>
                                <p className="text-sm text-zinc-500 mt-0.5">{t('upload_constraints_desc')}</p>
                            </div>
                            <div className="p-6">
                                <div
                                    {...getRootProps()}
                                    className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all ${
                                        isDragActive
                                            ? 'border-[var(--gold)] bg-[var(--gold)]/5'
                                            : 'border-white/10 hover:border-[var(--gold)]/40 hover:bg-white/[0.02]'
                                    }`}
                                >
                                    <input {...getInputProps()} />
                                    <div className={`w-16 h-16 rounded-2xl mb-4 flex items-center justify-center ${isDragActive ? 'bg-[var(--gold)]/20' : 'bg-white/5'}`}>
                                        <UploadCloud className={`w-8 h-8 ${isDragActive ? 'text-[var(--gold)]' : 'text-zinc-500'}`} />
                                    </div>
                                    <p className="text-sm font-semibold text-zinc-300 text-center">
                                        {isDragActive ? t('drop_files_here') : t('drag_drop_or_click')}
                                    </p>
                                    <p className="text-xs text-zinc-600 mt-1">JPG, PNG, GIF, WEBP, SVG, PDF, MP4, WEBM</p>
                                </div>
                            </div>
                        </div>

                        {/* File queue */}
                        {files.length > 0 && (
                            <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                                    <h3 className="text-sm font-bold text-white">{t('files_selected_count', { count: files.length })}</h3>
                                    {!uploading && !allDone && (
                                        <button onClick={() => setFiles([])} className="text-xs text-zinc-500 hover:text-red-400 transition">{t('clear_all')}</button>
                                    )}
                                </div>
                                <div className="divide-y divide-white/5 max-h-72 overflow-y-auto">
                                    {files.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 px-5 py-3">
                                            {/* Thumbnail */}
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#080808] flex items-center justify-center flex-shrink-0 border border-white/5">
                                                {item.preview
                                                    ? <img src={item.preview} alt="" className="w-full h-full object-cover" />
                                                    : <span className="text-[10px] text-zinc-500 uppercase">{item.file.name.split('.').pop()}</span>
                                                }
                                            </div>

                                            {/* Info + progress */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate font-medium">{item.file.name}</p>
                                                <p className="text-xs text-zinc-500">{formatBytes(item.file.size)}</p>
                                                {item.status === 'uploading' && (
                                                    <div className="mt-1.5 h-1 rounded-full bg-white/10 overflow-hidden">
                                                        <div
                                                            className="h-full bg-[var(--gold)] transition-all duration-300"
                                                            style={{ width: `${item.progress}%` }}
                                                        />
                                                    </div>
                                                )}
                                                {item.status === 'error' && item.error && (
                                                    <p className="text-xs text-red-400 mt-0.5 truncate">{item.error}</p>
                                                )}
                                            </div>

                                            {/* Status icon */}
                                            <div className="flex-shrink-0">
                                                {item.status === 'done' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                                                {item.status === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                                                {item.status === 'pending' && !uploading && (
                                                    <button onClick={() => removeFile(idx)} className="p-1 rounded-full hover:bg-red-500/20 text-zinc-500 hover:text-red-400 transition">
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                )}
                                                {item.status === 'uploading' && (
                                                    <span className="text-xs text-zinc-500">{item.progress}%</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right — Metadata */}
                    <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden">
                            <div className="px-5 py-4 border-b border-white/5">
                                <h3 className="text-sm font-bold text-white uppercase tracking-wide">{t('media_info')}</h3>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-1.5">{t('rename_file')}</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        placeholder={t('rename_file_placeholder')}
                                        className="w-full rounded-xl border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] placeholder-zinc-600"
                                    />
                                    <p className="text-xs text-zinc-600 mt-1">{t('rename_file_desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-24"></div>

            {/* Fixed Bottom Upload/Cancel Actions Bar */}
            <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-between items-center z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                <div>
                    {allDone && (
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                            <CheckCircle2 className="w-5 h-5" /> {t('all_files_uploaded_success')}
                        </div>
                    )}
                </div>
                <div className="flex gap-3">
                    <Link href={route('admin.media.index')} className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500">
                        {t('cancel')}
                    </Link>
                    <button
                        type="button"
                        onClick={uploadAll}
                        disabled={uploading || files.length === 0 || allDone}
                        className={`inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] ${
                            files.length > 0 && !uploading && !allDone
                                ? 'bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] cursor-pointer'
                                : 'bg-zinc-800 text-zinc-500 cursor-not-allowed opacity-40'
                        }`}
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#080808]/30 border-t-[#080808] rounded-full animate-spin mr-2" />
                                {t('uploading_with_dots')}
                            </>
                        ) : (
                            <>
                                <UploadCloud className="w-4 h-4 mr-2" />
                                {t('upload')} {files.length > 0 ? `${files.length} ${t('files_unit')}` : t('files_unit')}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
