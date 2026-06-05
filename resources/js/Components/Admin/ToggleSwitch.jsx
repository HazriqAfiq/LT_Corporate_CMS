import React from 'react';

export default function ToggleSwitch({
    id,
    checked,
    onChange,
    label,
    description,
    disabled = false
}) {
    return (
        <div className="flex items-center justify-between">
            {(label || description) && (
                <div className="mr-3">
                    {label && (
                        <label htmlFor={id} className="text-sm font-semibold text-zinc-300 block cursor-pointer select-none">
                            {label}
                        </label>
                    )}
                    {description && (
                        <span className="text-xs text-zinc-500 block mt-0.5 select-none">
                            {description}
                        </span>
                    )}
                </div>
            )}
            <label className={`relative inline-flex items-center select-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                    id={id}
                    type="checkbox"
                    checked={checked}
                    onChange={e => onChange && onChange(e.target.checked)}
                    disabled={disabled}
                    className="sr-only peer"
                />
                <div className="switch-toggle-track toggle-emerald"></div>
            </label>
        </div>
    );
}
