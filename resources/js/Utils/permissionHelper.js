export function getPermissionLabel(key, lang = 'bm') {
    if (key === 'manage_own_articles') {
        return lang === 'en' ? 'Manage Own Articles Only' : 'Urus Artikel Sendiri Sahaja';
    }

    const prefixes = {
        view: lang === 'en' ? 'View' : 'Lihat',
        create: lang === 'en' ? 'Create' : 'Tambah',
        edit: lang === 'en' ? 'Edit' : 'Kemaskini',
        delete: lang === 'en' ? 'Delete' : 'Padam',
        upload: lang === 'en' ? 'Upload' : 'Muat Naik',
        manage: lang === 'en' ? 'Manage' : 'Urus',
    };

    const nouns = {
        dashboard: lang === 'en' ? 'Dashboard' : 'Papan Pemuka',
        sliders: lang === 'en' ? 'Sliders' : 'Slider',
        articles: lang === 'en' ? 'Articles' : 'Artikel',
        products: lang === 'en' ? 'Products' : 'Produk',
        projects: lang === 'en' ? 'Projects' : 'Projek',
        media: lang === 'en' ? 'Media' : 'Media',
        inquiries: lang === 'en' ? 'Inquiries' : 'Pertanyaan',
        users: lang === 'en' ? 'Users' : 'Pengguna',
        settings: lang === 'en' ? 'Settings' : 'Tetapan',
        team: lang === 'en' ? 'Team Members' : 'Ahli Pasukan',
    };

    const parts = key.split('_');
    const prefix = parts[0];
    const noun = parts.slice(1).join('_');

    const prefixLabel = prefixes[prefix] || prefix;
    const nounLabel = nouns[noun] || noun;

    return `${prefixLabel} ${nounLabel}`;
}
