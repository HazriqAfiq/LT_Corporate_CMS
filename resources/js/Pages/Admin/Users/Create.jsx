import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Save, Upload } from 'lucide-react';

export default function Create({ availableRoles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        is_active: true,
        avatar: null,
        roles: [],
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('avatar', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRoleChange = (e) => {
        const options = e.target.options;
        const selectedRoles = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedRoles.push(options[i].value);
            }
        }
        setData('roles', selectedRoles);
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AdminLayout header="Tambah Pengguna">
            <Head title="Tambah Pengguna | Admin" />

            <div className="max-w-5xl mx-auto px-4">
                <div className="mb-6 flex items-center">
                    <Link href={route('admin.users.index')} className="text-zinc-500 hover:text-[var(--gold)] flex items-center transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-1.5" />
                        Kembali ke Senarai Pengguna
                    </Link>
                </div>

                <form onSubmit={submit} className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left Column (Main Content) */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-base font-bold text-white">Maklumat Pengguna</h2>
                                <p className="text-xs text-zinc-500 mt-1">Sila isi maklumat peribadi dan kelayakan akses pengguna baharu.</p>
                            </div>
                            <div className="p-6 space-y-6">
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Nama Penuh *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                            placeholder="Masukkan nama penuh"
                                            required
                                        />
                                        {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Alamat Emel *</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                            placeholder="nama@syarikat.com"
                                            required
                                        />
                                        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Nombor Telefon</label>
                                        <input
                                            type="text"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                            placeholder="Cth: +60123456789"
                                        />
                                        {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Kata Laluan *</label>
                                        <input
                                            type="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20"
                                            placeholder="Minimum 8 aksara"
                                            required
                                        />
                                        {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>}
                                    </div>
                                </div>

                             </div>
                        </div>
                    </div>

                    {/* Right Column (Sidebar Settings) */}
                    <div className="w-full lg:w-80 space-y-6 flex-shrink-0">
                        
                        {/* Avatar Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Avatar Pengguna</h2>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-center">
                                    <div className="relative group hover:border-[var(--gold)]/50 transition-colors cursor-pointer w-36 h-36 border-2 border-white/10 border-dashed rounded-full flex items-center justify-center p-1 bg-[#080808]">
                                        {imagePreview ? (
                                            <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-[var(--gold)]/30 group-hover:border-[var(--gold)] transition-all duration-300 shadow-lg shadow-[var(--gold)]/5">
                                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <span className="text-white text-xs font-semibold tracking-wide">Tukar</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-2 text-center py-4">
                                                <Upload className="mx-auto h-7 w-7 text-zinc-500 group-hover:text-[var(--gold)] transition-colors duration-300" />
                                                <p className="text-[11px] text-[var(--gold)] font-medium">Muat Naik</p>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer rounded-full" onChange={handleImageChange} accept="image/*" />
                                    </div>
                                </div>
                                {errors.avatar && <p className="mt-2 text-xs text-red-500 text-center">{errors.avatar}</p>}
                                <p className="text-[11px] text-zinc-500 mt-3 text-center">Format disyorkan: Square (JPG, PNG, WEBP)</p>
                            </div>
                        </div>

                        {/* Settings Card */}
                        <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                            <div className="p-4 border-b border-white/5 bg-[#080808]/50">
                                <h2 className="text-sm font-bold text-white uppercase tracking-wide">Peranan & Status</h2>
                            </div>
                            <div className="p-6 space-y-5">
                                
                                <div>
                                    <label className="block text-sm font-semibold text-zinc-300 mb-1.5">Peranan (Roles)</label>
                                    <select
                                        multiple
                                        value={data.roles}
                                        onChange={handleRoleChange}
                                        className="w-full rounded-lg border border-white/10 bg-[#080808] text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/20 focus:border-[var(--gold)] hover:border-white/20 min-h-[120px] transition-colors"
                                    >
                                        {availableRoles.map(role => (
                                            <option key={role.id} value={role.id} className="py-1.5 px-2 hover:bg-[var(--gold)]/10 checked:bg-[var(--gold)]/20 rounded">
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="mt-1.5 text-[10px] text-zinc-500 leading-normal">Tahan CTRL (Windows) atau CMD (Mac) untuk memilih lebih daripada satu.</p>
                                    {errors.roles && <p className="mt-1.5 text-xs text-red-500">{errors.roles}</p>}
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <label htmlFor="is_active" className="text-sm font-semibold text-zinc-300 cursor-pointer">
                                        Akaun Aktif
                                    </label>
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="h-4.5 w-4.5 accent-[var(--gold)] border-white/10 rounded cursor-pointer transition-colors"
                                    />
                                </div>

                            </div>
                        </div>

                    </div>

                </form>

                {/* Fixed Bottom Save/Cancel Actions Bar */}
                <div className="fixed bottom-0 left-0 lg:left-64 right-0 bg-[#080808] border-t border-white/5 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.3)]">
                    <Link
                        href={route('admin.users.index')}
                        className="inline-flex items-center px-5 py-2.5 border border-white/10 rounded-lg text-sm font-bold text-zinc-300 hover:text-white hover:bg-white/[0.02] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-500"
                    >
                        Batal
                    </Link>
                    <button
                        type="button"
                        onClick={submit}
                        disabled={processing}
                        className="inline-flex items-center px-6 py-2.5 border border-transparent rounded-lg text-sm font-bold bg-[var(--gold)] hover:bg-[var(--gold-light)] text-[#080808] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--gold)] disabled:opacity-50"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        {processing ? 'Menyimpan...' : 'Simpan Pengguna'}
                    </button>
                </div>

            </div>
            
            <div className="h-24"></div>

        </AdminLayout>
    );
}
