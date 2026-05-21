import { useState } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, LogIn, Key } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log Masuk Pentadbir" />

            {/* Centered Heading */}
            <div className="text-center mb-8 flex flex-col items-center">
                <div className="mb-4">
                    <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest select-none shadow-[0_0_15px_rgba(255,255,255,0.07)] backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                        </span>
                        Portal Log Masuk
                    </span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight">
                    Selamat Datang
                </h2>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                    Log masuk untuk mengakses dashboard pengurusan dan kawalan sistem.
                </p>
            </div>

            {status && (
                <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-sm font-medium text-yellow-600 flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500 shrink-0" />
                    <span>{status}</span>
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Email Input Field */}
                <div>
                    <label htmlFor="email" className="block font-semibold mb-2 text-xs text-zinc-400 flex items-center gap-1.5 select-none cursor-pointer">
                        <Mail className="w-3.5 h-3.5 text-yellow-500" /> Emel Pentadbir
                    </label>
 
                    <div className="w-full h-16 rounded-2xl bg-[#1c1c1e] border border-zinc-700/80 flex items-center p-1.5 pr-1.5 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all duration-200">
                        <div className="pl-3.5 pr-2 flex items-center justify-center shrink-0">
                            <Mail className="h-5 w-5 text-zinc-400" />
                        </div>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="w-full h-full bg-transparent text-white rounded-xl px-4 text-sm font-medium border-0 focus:ring-0 focus:outline-none transition-all duration-200 placeholder-zinc-500"
                            placeholder="Emel penuh anda"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />
                    </div>

                    <InputError message={errors.email} className="mt-2 text-xs font-semibold text-red-500" />
                </div>

                {/* Password Input Field */}
                <div>
                    <label htmlFor="password" className="block font-semibold mb-2 text-xs text-zinc-400 flex items-center gap-1.5 select-none cursor-pointer">
                        <Lock className="w-3.5 h-3.5 text-yellow-500" /> Kata Laluan
                    </label>
 
                    <div className="w-full h-16 rounded-2xl bg-[#1c1c1e] border border-zinc-700/80 flex items-center p-1.5 pr-1.5 focus-within:border-yellow-500 focus-within:ring-2 focus-within:ring-yellow-500/20 transition-all duration-200">
                        <div className="pl-3.5 pr-2 flex items-center justify-center shrink-0">
                            <Lock className="h-5 w-5 text-zinc-400" />
                        </div>
                        <TextInput
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            className="w-full h-full bg-transparent text-white rounded-xl px-4 text-sm font-medium border-0 focus:ring-0 focus:outline-none transition-all duration-200 placeholder-zinc-500"
                            placeholder="Masukkan kata laluan"
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-zinc-800/60 border border-zinc-700/65 text-zinc-400 hover:text-white hover:bg-zinc-700/70 transition-all duration-200 shrink-0 ml-1.5 focus:outline-none cursor-pointer"
                            title={showPassword ? 'Sembunyikan kata laluan' : 'Papar kata laluan'}
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                            ) : (
                                <Eye className="h-5 w-5" />
                            )}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2 text-xs font-semibold text-red-500" />
                </div>

                {/* Row: Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center cursor-pointer select-none">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="rounded border-zinc-700 bg-zinc-900 text-yellow-500 focus:ring-yellow-500/20 w-4 h-4 transition-colors"
                        />
                        <span className="ms-2 text-xs text-zinc-400 hover:text-white transition-colors font-semibold">
                            Ingat saya
                        </span>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-xs text-yellow-500 hover:text-yellow-400 hover:underline font-bold transition-colors focus:outline-none flex items-center gap-1.5"
                        >
                            <Key className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                            <span>Lupa kata laluan?</span>
                        </Link>
                    )}
                </div>

                {/* Submit Action: Golden Brand Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full relative h-14 flex items-center justify-center gap-2 px-5 text-sm font-black text-[#040914] rounded-2xl bg-yellow-500 hover:bg-yellow-400 transition-all duration-300 active:scale-[0.985] shadow-lg shadow-yellow-500/10 hover:shadow-xl hover:shadow-yellow-500/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                    >
                        {processing ? (
                            <span>Memproses...</span>
                        ) : (
                            <>
                                <LogIn className="w-4 h-4 shrink-0 text-[#040914]" />
                                <span>Akses Dashboard</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* Centered Credit Footer */}
            <div className="mt-8 text-center text-xs text-zinc-500 font-semibold select-none">
                Dikuasakan oleh Laman Teknologi
            </div>
        </GuestLayout>
    );
}

