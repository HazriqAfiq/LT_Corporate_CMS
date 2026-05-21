import { usePage } from '@inertiajs/react';

export default function ApplicationLogo(props) {
    const { settings = {} } = usePage().props;
    const logoUrl = settings.logo || '/storage/branding/logo.png';

    return (
        <img
            {...props}
            src={logoUrl}
            alt="Laman Teknologi Logo"
            className={`object-contain ${props.className || ''}`}
        />
    );
}
