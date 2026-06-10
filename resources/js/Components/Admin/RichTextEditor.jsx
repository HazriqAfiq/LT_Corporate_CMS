import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import MediaPickerModal from '@/Components/Media/MediaPickerModal';

/**
 * React 19 compatible custom Rich Text Editor using vanilla Quill.
 * Designed to bypass the legacy react-quill lifecycle crashes.
 */
export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Tulis kandungan di sini...',
    className = '',
    collection = 'branding',
}) {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const isChangeFromSelf = useRef(false);
    const onChangeRef = useRef(onChange);
    
    const [mediaPickerOpen, setMediaPickerOpen] = useState(false);
    const openMediaPickerRef = useRef(null);

    // Keep the ref updated with latest props to bypass stale closures
    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!containerRef.current) return;

        // Ensure the container is empty before initializing (strict-mode safety)
        containerRef.current.innerHTML = '';
        const editorDiv = document.createElement('div');
        containerRef.current.appendChild(editorDiv);

        // Map stable state setter to ref to prevent stable closure inside Quill handler
        openMediaPickerRef.current = () => {
            setMediaPickerOpen(true);
        };

        // Standard, high-quality Quill toolbar options with custom Media Library handler
        const quill = new Quill(editorDiv, {
            theme: 'snow',
            placeholder: placeholder,
            modules: {
                toolbar: {
                    container: [
                        [{ 'header': [1, 2, 3, 4, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        [{ 'align': [] }],
                        ['link', 'image'],
                        ['clean']
                    ],
                    handlers: {
                        image: function() {
                            if (openMediaPickerRef.current) {
                                openMediaPickerRef.current();
                            }
                        }
                    }
                }
            }
        });

        quillRef.current = quill;

        // Set initial value cleanly
        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        // On text change, notify the parent state only for user inputs
        quill.on('text-change', (delta, oldDelta, source) => {
            if (onChangeRef.current && source === 'user' && !isChangeFromSelf.current) {
                const html = editorDiv.firstChild.innerHTML;
                isChangeFromSelf.current = true;
                onChangeRef.current(html === '<br>' ? '' : html);
                isChangeFromSelf.current = false;
            }
        });

        return () => {
            // Clean up to prevent duplicate Quill mounts in React 19 dev mode
            quillRef.current = null;
        };
    }, []);

    // Sync value updates from parent container (e.g., reset forms or async loads)
    useEffect(() => {
        if (quillRef.current && !isChangeFromSelf.current) {
            const currentHTML = quillRef.current.root.innerHTML;
            if (value !== currentHTML && value !== '<br>') {
                const activeElement = document.activeElement;
                let selectionStart = null;
                let selectionEnd = null;
                let range = null;
                let selection = null;

                if (activeElement) {
                    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                        try {
                            selectionStart = activeElement.selectionStart;
                            selectionEnd = activeElement.selectionEnd;
                        } catch (e) {}
                    } else {
                        selection = window.getSelection();
                        if (selection && selection.rangeCount > 0) {
                            range = selection.getRangeAt(0).cloneRange();
                        }
                    }
                }

                // Programmatically update editor value without stealing focus if not focused
                isChangeFromSelf.current = true;
                if (quillRef.current.hasFocus()) {
                    quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
                } else {
                    quillRef.current.root.innerHTML = value || '';
                }

                // Restore focus if focus was stolen by the programmatic paste
                if (activeElement && activeElement !== document.body && document.activeElement !== activeElement) {
                    activeElement.focus();
                    if (selectionStart !== null && selectionEnd !== null) {
                        try {
                            activeElement.setSelectionRange(selectionStart, selectionEnd);
                        } catch (e) {}
                    } else if (range && selection) {
                        selection.removeAllRanges();
                        selection.addRange(range);
                    }
                }

                // Reset after mutation observer / event loop finishes processing change
                setTimeout(() => {
                    isChangeFromSelf.current = false;
                }, 50);
            }
        }
    }, [value]);

    const handleMediaSelect = (media) => {
        if (quillRef.current && media) {
            const quill = quillRef.current;
            const url = media.url;
            
            // Get current cursor selection or default to the end of the document
            const range = quill.getSelection(true);
            const index = range ? range.index : quill.getLength();
            
            // Insert the clean image URL from our Media Library
            quill.insertEmbed(index, 'image', url);
            
            // Advance cursor past the newly inserted image
            quill.setSelection(index + 1);

            // Explicitly sync the parent state container with new HTML markup
            const html = quill.root.innerHTML;
            if (onChangeRef.current) {
                isChangeFromSelf.current = true;
                onChangeRef.current(html === '<br>' ? '' : html);
                isChangeFromSelf.current = false;
            }
        }
    };

    return (
        <div className={`quill-dark-theme w-full rounded-xl overflow-hidden ${className}`}>
            <div ref={containerRef} className="w-full" />
            
            <MediaPickerModal
                show={mediaPickerOpen}
                onClose={() => setMediaPickerOpen(false)}
                onSelect={handleMediaSelect}
                collection={collection}
            />
        </div>
    );
}
