import React from 'react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export function Header({
    title,
    subtitle,
    showBack = false,
    rightAction,
    className
}) {
    const navigate = useNavigate();

    return (
        <header className={clsx(
            "sticky top-0 z-40 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-xl px-6 pt-12 pb-4 flex flex-col gap-4 border-b border-primary/10",
            className
        )}>
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    {showBack ? (
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all active:scale-95 -ml-2"
                        >
                            <span className="material-symbols-outlined text-sm font-bold">arrow_back_ios_new</span>
                        </button>
                    ) : (
                        <>
                            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[16px] font-bold">shield</span>
                            </div>
                            <span className="text-xs font-bold tracking-widest text-primary/60 uppercase">My Kernit</span>
                        </>
                    )}
                </div>

                {rightAction}
            </div>

            <div className="flex flex-col">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-xs text-slate-500 font-semibold tracking-wide mt-0.5">{subtitle}</p>
                )}
            </div>
        </header>
    );
}
