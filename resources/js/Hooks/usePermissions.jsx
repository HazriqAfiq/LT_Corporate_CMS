import { usePage } from '@inertiajs/react';

export default function usePermissions() {
    const { auth } = usePage().props;

    const hasRole = (roleName) => {
        return auth?.user?.roles?.includes(roleName) || false;
    };

    const hasPermission = (permission) => {
        if (hasRole('Super Admin')) return true;
        if (!permission) return true;
        return auth?.user?.permissions?.includes(permission) || false;
    };

    const hasManageOwn = (module = 'articles') => {
        return auth?.user?.permissions?.includes(`manage_own_${module}`) || false;
    };

    return { hasPermission, hasRole, hasManageOwn };
}
