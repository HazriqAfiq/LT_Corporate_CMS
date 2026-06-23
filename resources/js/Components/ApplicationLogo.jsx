import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ variant, ...props }) {
    const { settings = {} } = usePage().props;
    
    let logoUrl = settings.logo || '/storage/uploads/logo.webp';
    if (variant === 'dark' && settings.logo_admin_facing) {
        logoUrl = settings.logo_admin_facing;
    } else if (variant === 'footer' && settings.logo_footer) {
        logoUrl = settings.logo_footer;
    }

    return (
        <img
            {...props}
            src={logoUrl}
            alt="Laman Teknologi Logo"
            className={`object-contain ${props.className || ''}`}
        />
    );
}
