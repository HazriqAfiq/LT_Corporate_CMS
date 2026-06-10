import React, { useEffect, useState } from 'react';
import { Send, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react';
import useTranslation from '@/Hooks/useTranslation';

export default function SendConfirmModal({
    show = false,
    onClose = () => {},
    onConfirm = () => {},
    title = 'Hantar Newsletter?',
    message = 'Adakah anda pasti ingin menghantar e-mel ini kepada semua subscriber aktif?',
}) {
    const { t, lang } = useTranslation();
    const [status, setStatus] = useState('idle'); // 'idle' | 'sending' | 'success' | 'failed'
    const [resultData, setResultData] = useState(null);

    useEffect(() => {
        if (!show) {
            setStatus('idle');
            setResultData(null);
        }
    }, [show]);

    // Escape key listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && show && status === 'idle') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [show, onClose, status]);

    const handleConfirmClick = async () => {
        setStatus('sending');
        try {
            const res = await onConfirm(); // Resolves to { success, sent, failed, message }
            if (res && res.success) {
                setStatus('success');
                setResultData(res);
                setTimeout(() => {
                    onClose();
                }, 4000);
            } else {
                setStatus('failed');
                setResultData(res);
                setTimeout(() => {
                    setStatus('idle');
                }, 6000);
            }
        } catch (err) {
            setStatus('failed');
            setResultData({ success: false, message: t('newsletter_send_error') });
            setTimeout(() => {
                setStatus('idle');
            }, 6000);
        }
    };

    return (
        <Transition show={show} as={React.Fragment}>
            <Dialog
                as="div"
                className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
                onClose={() => {
                    if (status === 'idle') onClose();
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
                    <DialogPanel className="delete-confirm-modal send-confirm-modal relative w-full max-w-md bg-[#0c0c0e] border border-white/5 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden transform transition-all group">
                        {/* Glowing ambient gold background */}
                        <div className={`modal-glow absolute top-[-20%] left-[-20%] w-[200px] h-[200px] rounded-full blur-[80px] pointer-events-none z-0 transition-colors duration-500 ${
                            status === 'failed'
                                ? 'bg-red-500/10'
                                : 'bg-[var(--gold)]/10'
                        }`} />

                        {/* Top close 'X' button */}
                        {status === 'idle' && (
                            <button
                                onClick={onClose}
                                className="close-btn absolute top-4 right-4 z-20 p-1.5 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 transition-all duration-200 focus:outline-none"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Send Icon Badge */}
                            <div className="relative mb-5 mt-2">
                                <div className={`icon-badge-glow absolute -inset-2 rounded-full blur-md opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse ${
                                    status === 'failed'
                                        ? 'bg-red-500/20'
                                        : 'bg-[var(--gold)]/20'
                                }`} />
                                <div className={`icon-badge-bg relative w-14 h-14 rounded-full bg-[#141416] border flex items-center justify-center transition-colors duration-500 ${
                                    status === 'failed'
                                        ? 'border-red-500/20 text-red-500'
                                        : 'border-[var(--gold)]/20 text-[var(--gold)]'
                                }`}>
                                    {status === 'success' ? (
                                        <Check className="icon-badge-icon w-6 h-6 text-[var(--gold)] animate-scale-check" />
                                    ) : status === 'failed' ? (
                                        <AlertCircle className="icon-badge-icon w-6 h-6 text-red-500" />
                                    ) : (
                                        <Send className="icon-badge-icon w-5 h-5 ml-0.5 text-[var(--gold)]" />
                                    )}
                                </div>
                            </div>

                            {/* Titles & Description */}
                            <h3 className="modal-title text-lg font-bold text-white mb-2 leading-tight">
                                {status === 'success'
                                    ? (lang === 'en' ? 'Email Sent Successfully!' : 'E-mel Berjaya Dihantar!')
                                    : status === 'failed'
                                    ? (lang === 'en' ? 'Failed to Send Email' : 'Gagal Menghantar E-mel')
                                    : title
                                }
                              </h3>
                              <p className="modal-desc text-zinc-400 text-sm leading-relaxed px-2 mb-6">
                                  {status === 'success'
                                      ? t('newsletter_sent_success').replace(':count', resultData?.sent || 0)
                                      : status === 'failed'
                                      ? (resultData?.message || t('newsletter_send_error'))
                                      : message
                                  }
                              </p>

                              {/* Actions Buttons */}
                              <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
                                  {status === 'idle' && (
                                      <button
                                          type="button"
                                          onClick={onClose}
                                          className="btn-cancel flex-1 inline-flex items-center justify-center px-4 py-3 border border-white/10 rounded-xl text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                                      >
                                          Batal
                                      </button>
                                  )}
                                  <button
                                      type="button"
                                      onClick={handleConfirmClick}
                                      disabled={status !== 'idle'}
                                      className={`inline-flex items-center justify-center gap-2 px-4 py-3 border rounded-xl text-sm font-bold transition-all duration-300 disabled:cursor-not-allowed shadow-lg ${
                                          status !== 'idle' ? 'w-full' : 'flex-1'
                                      } ${
                                          status === 'success'
                                              ? 'btn-success-yellow'
                                              : status === 'failed'
                                              ? 'btn-success-red'
                                              : 'border-[var(--gold)]/30 bg-[var(--gold)]/10 hover:bg-[var(--gold)]/20 text-[var(--gold)]'
                                      }`}
                                  >
                                      {status === 'sending' ? (
                                          <>
                                              <Loader2 className="animate-spin h-4 w-4 text-[var(--gold)]" />
                                              {lang === 'en' ? 'Sending...' : 'Menghantar...'}
                                          </>
                                      ) : status === 'success' ? (
                                          <>
                                              <Check className="w-4 h-4 text-[var(--gold)]" />
                                              {t('newsletter_sent_success').replace(':count', resultData?.sent || 0)}
                                          </>
                                      ) : status === 'failed' ? (
                                          <>
                                              <AlertCircle className="w-4 h-4 text-red-500" />
                                              Gagal
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
