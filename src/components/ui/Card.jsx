import React from 'react';
import { clsx } from 'clsx';

export function Card({ children, className, onClick, ...props }) {
    return (
        <div
            className={clsx(
                "bg-white dark:bg-slate-900/50 border border-primary/10 rounded-[28px] p-6 shadow-sm",
                onClick && "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all active:scale-[0.98]",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {children}
        </div>
    );
}
