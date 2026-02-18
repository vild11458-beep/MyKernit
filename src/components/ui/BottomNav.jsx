import React from 'react';
import { NavLink } from 'react-router-dom';
import { clsx } from 'clsx';

export function BottomNav() {
    const navItems = [
        { icon: 'grid_view', label: 'Accueil', path: '/dashboard' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-xl border-t border-primary/5 px-12 pt-5 pb-3 flex justify-between items-center z-40 max-w-4xl mx-auto">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => clsx(
                        "flex flex-col items-center gap-1 transition-colors",
                        isActive ? "text-primary" : "text-slate-400"
                    )}
                >
                    <span className={clsx("material-symbols-outlined", { "font-bold": true })}>
                        {item.icon}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest">
                        {item.label}
                    </span>
                </NavLink>
            ))}
        </nav>
    );
}
