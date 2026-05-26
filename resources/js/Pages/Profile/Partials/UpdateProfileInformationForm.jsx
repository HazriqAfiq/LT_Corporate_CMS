import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import useTranslation from '@/Hooks/useTranslation';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const { t } = useTranslation();
    const user = usePage().props.auth.user;
    const [previewUrl, setPreviewUrl] = useState(null);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            avatar: null,
            _method: 'patch',
        });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-bold text-white uppercase tracking-wide">
                    {t('profile_info')}
                </h2>

                <p className="mt-1 text-sm text-zinc-500">
                    {t('profile_info_desc')}
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                    <div className="relative group self-start sm:self-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-white/10 flex items-center justify-center shrink-0">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                            ) : user.avatar_url ? (
                                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <span className="text-3xl font-bold text-[var(--gold)]">
                                    {(user.name || 'U').charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                        <input
                            type="file"
                            id="avatar"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarChange}
                        />
                        <label 
                            htmlFor="avatar"
                            className="absolute bottom-0 right-0 w-8 h-8 bg-[var(--gold)] text-[#080808] rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
                            title={t('change_avatar')}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </label>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white mb-1">{t('profile_picture')}</p>
                        <p className="text-xs text-zinc-500" dangerouslySetInnerHTML={{ __html: t('avatar_size_desc') }} />
                        {errors.avatar && (
                            <p className="mt-1.5 text-xs text-red-400 font-medium">
                                {errors.avatar}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-zinc-300 mb-1.5">
                        {t('full_name')}
                    </label>

                    <input
                        id="name"
                        type="text"
                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-all placeholder-zinc-600 font-medium"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoComplete="name"
                    />

                    {errors.name && (
                        <p className="mt-1.5 text-xs text-red-400 font-medium">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300 mb-1.5">
                        {t('email_address')}
                    </label>

                    <input
                        id="email"
                        type="email"
                        className="w-full rounded-md border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[var(--gold)] focus:border-[var(--gold)] transition-all placeholder-zinc-600 font-medium"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    {errors.email && (
                        <p className="mt-1.5 text-xs text-red-400 font-medium">
                            {errors.email}
                        </p>
                    )}
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="mt-2 text-sm text-zinc-300">
                            {t('email_unverified')}
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="ml-1 rounded-md text-sm text-zinc-400 hover:text-[var(--gold)] underline transition focus:outline-none"
                            >
                                {t('resend_verification')}
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-xs font-semibold text-emerald-400">
                                {t('verification_sent')}
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-[var(--gold)] text-[#080808] hover:opacity-90 transition disabled:opacity-50"
                    >
                        {t('save_profile')}
                    </button>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-emerald-400 font-semibold">
                            {t('saved_successfully')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
