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
        access: lang === 'en' ? 'Access' : 'Akses',
    };

    const parts = key.split('_');
    const prefix = parts[0];

    const prefixLabel = prefixes[prefix] || prefix.charAt(0).toUpperCase() + prefix.slice(1);

    return prefixLabel;
}
