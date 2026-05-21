import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ShieldCheck, Plus, Edit, Trash, Check, X } from 'lucide-react';

const roles = [
    { name: 'Super Admin', desc: 'Akses penuh kesemua modul dan tetapan sistem.', users: 1, color: 'text-[var(--gold)]', bg: 'bg-[var(--gold)]/10', border: 'border-[var(--gold)]/20' },
    { name: 'Admin', desc: 'Akses pengurusan kandungan, pengguna dan laporan.', users: 2, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20' },
    { name: 'Editor', desc: 'Boleh cipta dan edit kandungan sahaja.', users: 5, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20' },
    { name: 'Viewer', desc: 'Boleh melihat kandungan sahaja, tiada kebenaran edit.', users: 3, color: 'text-zinc-400', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20' },
];

const permissions = [
    { module: 'Dashboard', superAdmin: true, admin: true, editor: true, viewer: true },
    { module: 'Artikel', superAdmin: true, admin: true, editor: true, viewer: false },
    { module: 'Halaman', superAdmin: true, admin: true, editor: true, viewer: false },
    { module: 'Produk', superAdmin: true, admin: true, editor: true, viewer: false },
    { module: 'Portfolio', superAdmin: true, admin: true, editor: true, viewer: false },
    { module: 'Media Library', superAdmin: true, admin: true, editor: true, viewer: false },
    { module: 'Slider', superAdmin: true, admin: true, editor: false, viewer: false },
    { module: 'Inquiry', superAdmin: true, admin: true, editor: false, viewer: false },
    { module: 'Newsletter', superAdmin: true, admin: true, editor: false, viewer: false },
    { module: 'Pengguna', superAdmin: true, admin: true, editor: false, viewer: false },
    { module: 'Roles & Permissions', superAdmin: true, admin: false, editor: false, viewer: false },
    { module: 'SEO Settings', superAdmin: true, admin: true, editor: false, viewer: false },
    { module: 'Analytics', superAdmin: true, admin: true, editor: false, viewer: false },
    { module: 'Log Aktiviti', superAdmin: true, admin: true, editor: false, viewer: false },
    { module: 'Backup', superAdmin: true, admin: false, editor: false, viewer: false },
    { module: 'Maklumat Sistem', superAdmin: true, admin: false, editor: false, viewer: false },
    { module: 'Tetapan Website', superAdmin: true, admin: false, editor: false, viewer: false },
];

const Tick = ({ v }) => v
    ? <Check className="w-4 h-4 text-emerald-400 mx-auto" />
    : <X className="w-4 h-4 text-zinc-700 mx-auto" />;

export default function RolesIndex() {
    return (
        <AdminLayout header="Roles & Permissions">
            <Head title="Roles & Permissions | Admin" />

            {/* Dev Banner */}
            <div className="mb-6 flex items-center gap-3 px-5 py-3.5 bg-[var(--gold)]/10 border border-[var(--gold)]/20 rounded-2xl">
                <ShieldCheck className="w-5 h-5 text-[var(--gold)] shrink-0" />
                <div>
                    <p className="text-[var(--gold)] font-semibold text-sm">Modul Dalam Pembangunan</p>
                    <p className="text-zinc-400 text-xs mt-0.5">Konfigurasi roles dan permissions di bawah adalah reka bentuk cadangan. Backend akan dihubungkan kemudian.</p>
                </div>
            </div>

            {/* Role Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {roles.map((role, i) => (
                    <div key={i} className={`bg-[#0c0c0e] border ${role.border} rounded-2xl p-5 relative group`}>
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${role.bg} mb-4`}>
                            <ShieldCheck className={`w-5 h-5 ${role.color}`} />
                        </div>
                        <h3 className={`font-bold text-base mb-1 ${role.color}`}>{role.name}</h3>
                        <p className="text-zinc-500 text-xs leading-relaxed mb-3">{role.desc}</p>
                        <p className="text-zinc-400 text-xs"><span className="text-white font-bold">{role.users}</span> pengguna</p>
                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-1.5 text-zinc-500 hover:text-[var(--gold)] hover:bg-[var(--gold)]/10 rounded-lg transition-all"><Edit className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"><Trash className="w-3.5 h-3.5" /></button>
                        </div>
                    </div>
                ))}
                <button className="bg-[#0c0c0e] border border-dashed border-white/10 rounded-2xl p-5 flex flex-col items-center justify-center gap-2 hover:border-[var(--gold)]/30 hover:bg-[var(--gold)]/5 transition-all group">
                    <Plus className="w-6 h-6 text-zinc-600 group-hover:text-[var(--gold)]" />
                    <span className="text-zinc-600 group-hover:text-[var(--gold)] text-sm font-medium transition-colors">Tambah Role</span>
                </button>
            </div>

            {/* Permission Matrix */}
            <div className="bg-[#0c0c0e] border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h2 className="text-white font-bold text-sm">Matriks Kebenaran (Permission Matrix)</h2>
                    <p className="text-zinc-500 text-xs mt-0.5">Akses modul mengikut setiap role</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-[#080808]/50 text-xs font-semibold uppercase tracking-wider">
                                <th className="px-6 py-3 text-zinc-500">Modul</th>
                                {roles.map(r => <th key={r.name} className={`px-6 py-3 text-center ${r.color}`}>{r.name}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {permissions.map((p, i) => (
                                <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                                    <td className="px-6 py-3 text-sm text-zinc-300 font-medium">{p.module}</td>
                                    <td className="px-6 py-3"><Tick v={p.superAdmin} /></td>
                                    <td className="px-6 py-3"><Tick v={p.admin} /></td>
                                    <td className="px-6 py-3"><Tick v={p.editor} /></td>
                                    <td className="px-6 py-3"><Tick v={p.viewer} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
