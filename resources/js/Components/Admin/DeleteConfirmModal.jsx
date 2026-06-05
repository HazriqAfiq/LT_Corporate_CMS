import React, { useEffect, useState } from 'react';
import { Trash2, AlertTriangle, X, Check } from 'lucide-react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import { router } from '@inertiajs/react';
import useTranslation from '@/Hooks/useTranslation';

export default function DeleteConfirmModal({
    show = false,
    onClose = () => {},
    onConfirm = () => {},
    url = null,
    redirectUrl = null,
    method = 'delete',
    data = null,
    title,
    message,
    processing = false,
}) {
    const { t } = useTranslation();
    const displayTitle = title || t('confirm_delete_title');
    const displayMessage = message || t('confirm_delete_message');

    const [localProcessing, setLocalProcessing] = useState(false);
    const [localSuccess, setLocalSuccess] = useState(false);

    // Reset state when modal is opened/closed
    useEffect(() => {
        if (!show) {
            setLocalProcessing(false);
            setLocalSuccess(false);
        }
    }, [show]);

    // Escape key listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && show && !processing && !localProcessing) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, onClose, processing, localProcessing]);

    const handleConfirmClick = () => {
        if (url) {
            setLocalProcessing(true);
            const request = method.toLowerCase() === 'post'
                ? window.axios.post(url, data)
                : window.axios.post(url, { ...(data || {}), _method: 'DELETE' });

            request
                .then(() => {
                    setLocalSuccess(true);
                    setTimeout(() => {
                        setLocalSuccess(false);
                        onClose();
                        setTimeout(() => {
                            if (redirectUrl) {
                                router.visit(redirectUrl);
                            } else {
                                router.reload();
                            }
                        }, 200);
                    }, 1500);
                })
                .catch((err) => {
                    setLocalProcessing(false);
                    console.error('Delete request failed:', err);
                    alert('Gagal memadam rekod.');
                });
        } else {
            onConfirm();
        }
    };

    return (
        <Transition show={show} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClose={() => {
                    if (!processing && !localProcessing) onClose();
                }}
            >
                {/* Backdrop overlay */}
                <TransitionChild
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" />
                </TransitionChild>

                {/* Modal Container */}
                <TransitionChild
                    as={React.Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 scale-95 translate-y-4"
                    enterTo="opacity-100 scale-100 translate-y-0"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 scale-100 translate-y-0"
                    leaveTo="opacity-0 scale-95 translate-y-4"
                >
                    <DialogPanel className="delete-confirm-modal relative w-full max-w-md bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden transform transition-all group">
                        {/* Glowing ambient red background */}
                        <div className="modal-glow absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full bg-red-500/10 blur-[80px] pointer-events-none z-0" />

                        {/* Top close 'X' button */}
                        {!processing && !localProcessing && (
                            <button
                                onClick={onClose}
                                className="close-btn absolute top-4 right-4 z-20 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Warning Icon Badge */}
                            <div className="relative mb-5 mt-2">
                                <div className="icon-badge-glow absolute -inset-2 bg-red-500/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                                <div className="icon-badge-bg relative w-14 h-14 rounded-full bg-[#141416] border border-red-500/20 flex items-center justify-center">
                                    {localSuccess ? (
                                        <Check className="icon-badge-icon w-6 h-6 text-red-500 animate-scale-check" />
                                    ) : (
                                        <Trash2 className="icon-badge-icon w-6 h-6 text-red-500" />
                                    )}
                                </div>
                            </div>

                            {/* Titles & Description */}
                            <h3 className="modal-title text-lg font-bold text-white mb-2 leading-tight">
                                {displayTitle}
                            </h3>
                            <p className="modal-desc text-zinc-400 text-sm leading-relaxed px-2 mb-6">
                                {displayMessage}
                            </p>

                            {/* Actions Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={processing || localProcessing}
                                    className="btn-cancel flex-1 inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {t('cancel')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleConfirmClick}
                                    disabled={processing || localProcessing || localSuccess}
                                    className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${
                                        localSuccess
                                            ? 'btn-success-red'
                                            : 'btn-confirm-delete-soft'
                                    }`}
                                >
                                    {localSuccess ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            {t('deleted_successfully')}
                                        </>
                                    ) : localProcessing || processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                            {t('deleting')}
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="w-4 h-4" />
                                            {t('delete_record')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
