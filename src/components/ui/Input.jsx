import React, { forwardRef } from 'react';
import { clsx } from 'clsx';

/**
 * Premium Input component with high contrast and smooth transitions.
 * Updated to match the Forest Green (emerald-900) brand palette.
 */
export const Input = forwardRef(({
    label,
    icon,
    error,
    className,
    containerClassName,
    ...props
}, ref) => {
    return (
        <div className={clsx("space-y-3", containerClassName)}>
            {label && (
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-6 italic">
                    {label}
                </label>
            )}
            <div className="relative group">
                {icon && (
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-900 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">{icon}</span>
                    </span>
                )}
                <input
                    ref={ref}
                    className={clsx(
                        "w-full py-5 bg-slate-50 border border-slate-100 rounded-[22px] focus:ring-4 focus:ring-emerald-900/5 focus:border-emerald-900/20 focus:bg-white outline-none transition-all placeholder:text-slate-300 text-slate-800 text-sm font-bold shadow-sm",
                        icon ? "pl-16 pr-8" : "px-8",
                        error
                            ? "border-red-200 bg-red-50/30 focus:ring-red-500/5 focus:border-red-500/20"
                            : "",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <div className="flex items-center gap-2 ml-6 text-red-500 animate-fade-in-up">
                    <span className="material-symbols-outlined text-sm">error</span>
                    <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
            )}
        </div>
    );
});

Input.displayName = 'Input';
