import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

export function ConfirmDialog({ isOpen, onConfirm, onCancel, title, message, confirmText = 'Supprimer', isDangerous = false }) {
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
            {/* Backdrop with premium blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-fade-in"
                onClick={onCancel}
            />

            {/* Modal Container */}
            <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] p-10 overflow-hidden animate-scale-in">
                {/* Decorative shape */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 ${isDangerous ? 'bg-red-500/5' : 'bg-emerald-900/5'}`}></div>

                <div className="relative z-10">
                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDangerous ? 'bg-red-50' : 'bg-emerald-50'}`}>
                            <span className={`material-symbols-outlined text-[32px] ${isDangerous ? 'text-red-500' : 'text-emerald-900'}`}>
                                {isDangerous ? 'warning' : 'help'}
                            </span>
                        </div>
                    </div>

                    {/* Content */}
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 text-center mb-4">
                        {title}
                    </h2>
                    
                    <p className="text-center text-slate-400 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                        {message}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 h-12 rounded-[24px] border border-slate-100 bg-white text-slate-900 font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 h-12 rounded-[24px] font-black text-sm uppercase tracking-widest transition-all active:scale-95 text-white ${isDangerous ? 'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/20' : 'bg-emerald-900 hover:bg-emerald-950 shadow-lg shadow-emerald-900/20'}`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
