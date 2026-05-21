import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

/**
 * React 19 compatible custom Rich Text Editor using vanilla Quill.
 * Designed to bypass the legacy react-quill lifecycle crashes.
 */
export default function RichTextEditor({
    value = '',
    onChange,
    placeholder = 'Tulis kandungan di sini...',
    className = '',
}) {
    const containerRef = useRef(null);
    const quillRef = useRef(null);
    const isChangeFromSelf = useRef(false);

    useEffect(() => {
        if (!containerRef.current) return;

        // Ensure the container is empty before initializing (strict-mode safety)
        containerRef.current.innerHTML = '';
        const editorDiv = document.createElement('div');
        containerRef.current.appendChild(editorDiv);

        // Standard, high-quality Quill toolbar options
        const quill = new Quill(editorDiv, {
            theme: 'snow',
            placeholder: placeholder,
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });

        quillRef.current = quill;

        // Set initial value cleanly
        if (value) {
            quill.clipboard.dangerouslyPasteHTML(value);
        }

        // On text change, notify the parent state
        quill.on('text-change', () => {
            if (onChange) {
                const html = editorDiv.firstChild.innerHTML;
                isChangeFromSelf.current = true;
                onChange(html === '<br>' ? '' : html);
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
                const selection = quillRef.current.getSelection();
                quillRef.current.clipboard.dangerouslyPasteHTML(value || '');
                if (selection) {
                    quillRef.current.setSelection(selection);
                }
            }
        }
    }, [value]);

    return (
        <div className={`quill-dark-theme w-full rounded-xl overflow-hidden ${className}`}>
            <div ref={containerRef} className="w-full" />
        </div>
    );
}
