import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

export default function DeleteUserForm({ className = '' }) {
    const { t } = useTranslation();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    {t('delete_account')}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    {t('delete_account_desc')}
                </p>
            </header>

            <button
                type="button"
                onClick={confirmUserDeletion}
                className="inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition"
            >
                {t('delete_account')}
            </button>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 bg-[#0c0c0e] text-white">
                    <h2 className="text-lg font-bold text-white">
                        {t('delete_account_confirm_title')}
                    </h2>

                    <p className="mt-2 text-sm text-zinc-400">
                        {t('delete_account_confirm_desc')}
                    </p>

                    <div className="mt-6">
                        <label htmlFor="password" className="sr-only">
                            {t('password')}
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full sm:w-3/4 rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-all placeholder-zinc-600 font-medium"
                            required
                            placeholder={t('password')}
                        />

                        {errors.password && (
                            <p className="mt-1.5 text-xs text-red-400 font-medium">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={closeModal}
                            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-white/5 text-white border border-white/10 hover:bg-white/10 transition"
                        >
                            {t('cancel')}
                        </button>

                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-700 transition disabled:opacity-50"
                        >
                            {t('delete_account')}
                        </button>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
