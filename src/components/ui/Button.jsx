import React from 'react';
import { clsx } from 'clsx';

/**
 * Reusable Button component with explicit premium Indigo-Blue primary theme.
 */
export function Button({
    children,
    variant = 'primary',
    className,
    type = 'button',
    fullWidth = false,
    icon,
    ...props
}) {
    const baseStyles = "font-bold rounded-2xl transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[11px]";

    const variants = {
        primary: "bg-[#3b52f6] hover:bg-[#2539ed] text-white shadow-lg shadow-blue-500/25 border border-blue-500/10",
        secondary: "bg-primary-50 hover:bg-primary-100 text-[#3b52f6] border border-primary-100",
        ghost: "bg-transparent hover:bg-slate-50 text-slate-500 hover:text-slate-900 border border-transparent",
        danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 shadow-sm"
    };

    const sizes = "py-4 px-8";

    return (
        <button
            type={type}
            className={clsx(
                baseStyles,
                variants[variant],
                sizes,
                fullWidth ? "w-full" : "w-auto",
                className
            )}
            {...props}
        >
            {icon && <span className="material-symbols-outlined text-[18px]">{icon}</span>}
            {children}
        </button>
    );
}
