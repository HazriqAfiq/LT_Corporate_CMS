import { useState, useEffect } from 'react';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, ArrowLeft, Key } from 'lucide-react';

export default function ForgotPassword({ status }) {
    const [lang, setLang] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('lang') || 'bm' : 'bm'));
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    useEffect(() => {
        const storedLang = localStorage.getItem('lang') || 'bm';
        setLang(storedLang);

        const handleLangChange = () => {
            setLang(localStorage.getItem('lang') || 'bm');
        };
        window.addEventListener('languageChange', handleLangChange);

        return () => {
            window.removeEventListener('languageChange', handleLangChange);
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    const translations = {
        bm: {
            pageTitle: 'Lupa Kata Laluan Pentadbir',
            description: 'Lupa kata laluan anda? Sila masukkan alamat emel berdaftar anda dan kami akan emel pautan tetapan semula kata laluan.',
            emailLabel: 'Emel Pentadbir',
            emailPlaceholder: 'Emel penuh anda',
            processing: 'Memproses...',
            submitBtn: 'Hantar Pautan Tetapan Semula',
            backToLogin: 'Kembali ke Log Masuk',
            poweredBy: 'Dikuasakan oleh Laman Teknologi'
        },
        en: {
            pageTitle: 'Admin Forgot Password',
            description: 'Forgot your password? Please enter your registered email address and we will email you a password reset link.',
            emailLabel: 'Admin Email',
            emailPlaceholder: 'Your full email',
            processing: 'Processing...',
            submitBtn: 'Send Password Reset Link',
            backToLogin: 'Back to Login',
            poweredBy: 'Powered by Laman Teknologi'
        }
    };

    const t = translations[lang] || translations.bm;

    return (
        <GuestLayout>
            <Head title={t.pageTitle} />

            {/* Centered Heading */}
            <div className="text-center mb-8 flex flex-col items-center">
                <h2 className="text-3xl font-black text-white tracking-tight">
                    {t.pageTitle}
                </h2>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    {t.description}
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 rounded-lg bg-green-950/40 border border-green-500/30 text-sm font-medium text-green-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Email Input Field */}
                <div>
                    <label htmlFor="email" className="block font-semibold mb-2 text-xs text-zinc-400 flex items-center gap-1.5 select-none cursor-pointer">
                        <Mail className="w-3.5 h-3.5 text-yellow-500" /> {t.emailLabel}
                    </label>
 
                    <div className="w-full h-16 rounded-lg bg-[#1c1c1e] border border-zinc-700/80 flex items-center p-1.5 pr-1.5 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all duration-200">
                        <div className="pl-3.5 pr-2 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-zinc-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full h-full bg-transparent text-white rounded-lg px-4 text-sm font-medium border-0 focus:ring-0 focus:outline-none transition-all duration-200 placeholder-zinc-500"
                            placeholder={t.emailPlaceholder}
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>

                    <InputError message={errors.email} className="mt-2 text-xs font-semibold text-red-500" />
                </div>

                {/* Submit Action: Golden Brand Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full relative h-14 flex items-center justify-center gap-2 px-5 text-sm font-black text-[#040914] rounded-md bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 active:scale-[0.985] shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                        {processing ? (
                            <span>{t.processing}</span>
                        ) : (
                            <>
                                <Key className="w-4 h-4 shrink-0 text-[#040914]" />
                                <span>{t.submitBtn}</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Back to Login Navigation */}
                <div className="text-center pt-2">
                    <Link
                        href={route('login')}
                        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors focus:outline-none"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>{t.backToLogin}</span>
                    </Link>
                </div>
            </form>

            {/* Centered Credit Footer */}
            <div className="mt-8 text-center text-xs text-zinc-500 font-semibold select-none">
                {t.poweredBy}
            </div>
        </GuestLayout>
    );
}
