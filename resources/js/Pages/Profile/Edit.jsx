import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import useTranslation from '@/Hooks/useTranslation';

export default function Edit({ mustVerifyEmail, status }) {
    const { t } = useTranslation();

    return (
        <AdminLayout header={t('profile_title')}>
            <Head title={`${t('profile_title')} | Admin`} />

            <div className="max-w-4xl mx-auto space-y-6 pb-12">
                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 p-6 sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </div>

                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 p-6 sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </div>

                <div className="bg-[#0c0c0e] rounded-2xl border border-white/5 p-6 sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </div>
            </div>
        </AdminLayout>
    );
}
