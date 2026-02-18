import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';

export function Modal({ isOpen, onClose, title, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            {/* Backdrop with a premium blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-md bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-10 overflow-hidden animate-scale-in">
                {/* Decorative shape */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 border-l-4 border-primary pl-4 leading-none">
                            {title}
                        </h2>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active-shrink"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto no-scrollbar py-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
