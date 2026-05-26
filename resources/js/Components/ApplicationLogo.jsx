import { usePage } from '@inertiajs/react';

export default function ApplicationLogo({ variant, ...props }) {
    const { settings = {} } = usePage().props;
    
    let logoUrl = settings.logo || '/storage/uploads/branding/logo.png';
    if (variant === 'dark' && settings.logo_dark) {
        logoUrl = settings.logo_dark;
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
