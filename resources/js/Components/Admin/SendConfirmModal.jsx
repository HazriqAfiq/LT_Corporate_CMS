import React, { useEffect } from 'react';
import { Send, X } from 'lucide-react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';

export default function SendConfirmModal({
    show = false,
    onClose = () => {},
    onConfirm = () => {},
    title = 'Hantar Newsletter?',
    message = 'Adakah anda pasti ingin menghantar e-mel ini kepada semua subscriber aktif?',
    processing = false,
}) {
    // Escape key listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && show && !processing) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, onClose, processing]);

    return (
        <Transition show={show} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClose={() => {
                    if (!processing) onClose();
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
                    <DialogPanel className="relative w-full max-w-md bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden transform transition-all group">
                        {/* Glowing ambient gold background */}
                        <div className="absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full bg-[var(--gold)]/10 blur-[80px] pointer-events-none z-0" />

                        {/* Top close 'X' button */}
                        {!processing && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Send Icon Badge */}
                            <div className="relative mb-5 mt-2">
                                <div className="absolute -inset-2 bg-[var(--gold)]/20 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
                                <div className="relative w-14 h-14 rounded-full bg-[#141416] border border-[var(--gold)]/20 flex items-center justify-center">
                                    <Send className="w-5 h-5 text-[var(--gold)] ml-0.5" />
                                </div>
                            </div>

                            {/* Titles & Description */}
                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                                {title}
                            </h3>
                            <p className="text-zinc-400 text-sm leading-relaxed px-2 mb-6">
                                {message}
                            </p>

                            {/* Actions Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={onConfirm}
                                    disabled={processing}
                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-transparent rounded-xl text-sm font-bold bg-[var(--gold)] hover:opacity-90 text-[#080808] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[var(--gold)]/10"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#080808] border-t-transparent" />
                                            Menghantar...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Hantar E-mel
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
