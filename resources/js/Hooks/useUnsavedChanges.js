import { useState } from 'react';
import { router } from '@inertiajs/react';

/**
 * useUnsavedChanges
 *
 * Provides state and handlers for showing an "Unsaved Changes" modal
 * when users try to navigate away from a form with unsaved changes.
 *
 * @param {boolean} isDirty - Whether the form has unsaved changes
 * @returns {object} { showModal, openModal, closeModal, handleNavigation, handleDiscard }
 */
export default function useUnsavedChanges(isDirty) {
    const [showModal, setShowModal] = useState(false);
    const [pendingUrl, setPendingUrl] = useState(null);

    /**
     * Call this instead of navigating directly.
     * If dirty, shows modal; otherwise navigates immediately.
     */
    const handleNavigation = (url) => {
        if (isDirty) {
            setPendingUrl(url);
            setShowModal(true);
        } else {
            router.visit(url);
        }
    };

    /**
     * Used by Back/Cancel buttons — accepts an event and a target URL.
     */
    const handleNavigationClick = (e, url) => {
        e.preventDefault();
        handleNavigation(url);
    };

    const closeModal = () => setShowModal(false);

    const handleDiscard = () => {
        setShowModal(false);
        if (pendingUrl) {
            router.visit(pendingUrl);
        }
    };

    return {
        showModal,
        closeModal,
        handleNavigation,
        handleNavigationClick,
        handleDiscard,
    };
}
