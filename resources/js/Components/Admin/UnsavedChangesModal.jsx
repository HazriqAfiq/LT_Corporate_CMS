import React, { useEffect } from 'react';
import { AlertTriangle, X, Check } from 'lucide-react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import useTranslation from '@/Hooks/useTranslation';

/**
 * UnsavedChangesModal
 *
 * Props:
 *  - show: boolean
 *  - onClose: () => void  — "Continue Editing" / cancel
 *  - onDiscard: () => void — navigate away without saving
 *  - processing?: boolean
 */
export default function UnsavedChangesModal({
    show = false,
    onClose = () => {},
    onDiscard = () => {},
    onSaveDraft = null,
    processing = false,
}) {
    const { t, lang } = useTranslation();
    const [discardStatus, setDiscardStatus] = React.useState('idle'); // 'idle' | 'success'
    const [saveDraftStatus, setSaveDraftStatus] = React.useState('idle'); // 'idle' | 'processing' | 'success'
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && show && !processing && saveDraftStatus === 'idle' && discardStatus === 'idle') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, onClose, processing, saveDraftStatus, discardStatus]);

    const handleDiscardClick = () => {
        setDiscardStatus('success');
        setTimeout(() => {
            onDiscard();
        }, 1500);
    };

    const handleSaveDraftClick = async () => {
        if (!onSaveDraft) return;
        setSaveDraftStatus('processing');
        try {
            await onSaveDraft();
            setSaveDraftStatus('success');
        } catch (e) {
            setSaveDraftStatus('idle');
        }
    };

    return (
        <Transition show={show} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClose={() => {
                    if (!processing && saveDraftStatus === 'idle' && discardStatus === 'idle') onClose();
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
                    <DialogPanel className="unsaved-changes-modal delete-confirm-modal relative w-full max-w-md bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden transform transition-all group">
                        {/* Glowing ambient amber background */}
                        <div className="modal-glow absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full bg-amber-500/10 blur-[80px] pointer-events-none z-0" />
 
                        {/* Top close 'X' button */}
                        {!processing && saveDraftStatus === 'idle' && discardStatus === 'idle' && (
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
                                <div className={`icon-badge-glow absolute -inset-2 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse ${
                                    discardStatus === 'success'
                                        ? 'bg-zinc-500/20'
                                        : saveDraftStatus === 'success'
                                        ? 'bg-[var(--gold)]/20'
                                        : 'bg-amber-500/20'
                                }`} />
                                <div className={`icon-badge-bg relative w-14 h-14 rounded-full bg-[#141416] border flex items-center justify-center ${
                                    discardStatus === 'success'
                                        ? 'border-zinc-500/20 text-zinc-400'
                                        : saveDraftStatus === 'success'
                                        ? 'border-[var(--gold)]/20 text-[var(--gold)]'
                                        : 'border-amber-500/20 text-amber-400'
                                }`}>
                                    {discardStatus === 'success' || saveDraftStatus === 'success' ? (
                                        <Check className="icon-badge-icon w-6 h-6 animate-scale-check" />
                                    ) : (
                                        <AlertTriangle className="icon-badge-icon w-6 h-6" />
                                    )}
                                </div>
                            </div>
 
                            {/* Title & Description */}
                            <h3 className="modal-title text-lg font-bold text-white mb-2 leading-tight">
                                {t('unsaved_changes_title')}
                            </h3>
                            <p className="modal-desc text-zinc-400 text-sm leading-relaxed px-2 mb-6">
                                {t('unsaved_changes_message')}
                            </p>
 
                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 w-full mt-2">
                                {/* Save Draft — only shown on Articles Create */}
                                {onSaveDraft && (
                                    <button
                                        type="button"
                                        onClick={handleSaveDraftClick}
                                        disabled={processing || saveDraftStatus !== 'idle' || discardStatus !== 'idle'}
                                        className={`btn-save-draft inline-flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            saveDraftStatus === 'success'
                                                ? 'btn-success-yellow'
                                                : 'border-[var(--gold)]/30 bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 text-[var(--gold)]'
                                        }`}
                                    >
                                        {saveDraftStatus === 'success' ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                {t('saved_successfully')}
                                            </>
                                        ) : saveDraftStatus === 'processing' ? (
                                            <>
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                                                {t('saving')}
                                            </>
                                        ) : (
                                            t('save_draft')
                                        )}
                                    </button>
                                )}
 
                                <div className="flex flex-col sm:flex-row gap-3 w-full">
                                    {/* Continue Editing */}
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={processing || saveDraftStatus !== 'idle' || discardStatus !== 'idle'}
                                        className="btn-cancel flex-1 inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {t('continue_editing')}
                                    </button>
 
                                    {/* Discard Changes */}
                                    <button
                                        type="button"
                                        onClick={handleDiscardClick}
                                        disabled={processing || saveDraftStatus !== 'idle' || discardStatus !== 'idle'}
                                        className={`btn-discard flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
                                            discardStatus === 'success'
                                                ? 'btn-success-grey'
                                                : 'border-transparent bg-zinc-700 hover:bg-zinc-600 text-white'
                                        }`}
                                    >
                                        {discardStatus === 'success' ? (
                                            <>
                                                <Check className="w-4 h-4" />
                                                {lang === 'en' ? 'Changes Discarded' : 'Perubahan Dibuang'}
                                            </>
                                        ) : (
                                            t('discard_changes')
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </Dialog>
        </Transition>
    );
}
