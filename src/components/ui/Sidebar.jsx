import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { useAuth } from '../../contexts/AuthContext';
import { useAllTransactions } from '../../hooks/index';
import { Logo } from './Logo';
import { Modal } from './Modal';

export function Sidebar() {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const transactions = useAllTransactions();

    const [hasNewStats, setHasNewStats] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const menuItems = [
        { icon: 'grid_view', label: 'Tableau de bord', path: '/dashboard' },
        { icon: 'analytics', label: 'Statistiques', path: '/reports' },
    ];

    useEffect(() => {
        const latestTxTime = transactions.length > 0
            ? Math.max(...transactions.map(t => t.timestamp))
            : 0;

        const lastViewedTime = parseInt(localStorage.getItem('lastViewedStats') || '0');

        if (latestTxTime > lastViewedTime && location.pathname !== '/reports') {
            setHasNewStats(true);
        }

        if (location.pathname === '/reports') {
            localStorage.setItem('lastViewedStats', Date.now().toString());
            setHasNewStats(false);
        }
    }, [transactions, location.pathname]);

    const handleLogout = async () => {
        logout();
        navigate('/selection', { replace: true });
        setShowLogoutConfirm(false);
    };

    return (
        <>
            <aside className="w-72 h-screen fixed left-0 top-0 bg-white flex flex-col z-40 border-r border-slate-100 transition-all duration-700 shadow-[20px_0_60px_rgba(0,0,0,0.02)]">
                {/* Brand Section */}
                <div className="p-10 pb-10 flex flex-col items-center border-b border-slate-50">
                    <div className="flex flex-col items-center gap-5 animate-fade-in-up">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <Logo className="w-16 h-16 relative z-10 transition-transform duration-700 hover:rotate-3" />
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <h2 className="font-extrabold tracking-tight text-emerald-950 text-2xl leading-none italic">My Kernit</h2>
                            <div className="flex items-center gap-1.5 mt-2 bg-emerald-950/5 px-2.5 py-1 rounded-full border border-emerald-950/5">
                                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-[8px] font-black text-emerald-900 uppercase tracking-[0.2em] italic opacity-60">Admin Pro</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 px-4 space-y-2 animate-fade-in-up stagger-1 mt-8">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] px-6 mb-6">Navigation</p>
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.label}
                            to={item.path}
                            className={({ isActive }) => clsx(
                                "flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-300 font-bold text-[14px] active-shrink group",
                                isActive
                                    ? "bg-emerald-950 text-white shadow-xl shadow-emerald-950/20"
                                    : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-900"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <div className={clsx(
                                        "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm border",
                                        isActive
                                            ? "bg-white/10 border-white/10 text-white"
                                            : "bg-slate-50 border-slate-100 text-slate-400 group-hover:bg-white group-hover:border-emerald-100 group-hover:text-emerald-900"
                                    )}>
                                        <span className="material-symbols-outlined text-[20px] transition-all group-hover:scale-110">
                                            {item.icon}
                                        </span>
                                    </div>
                                    <span className="tracking-tight">{item.label}</span>

                                    {item.label === 'Statistiques' && hasNewStats && (
                                        <span className="ml-auto w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.4)]"></span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* System Section */}
                <div className="p-8 pt-0 animate-fade-in-up stagger-3">
                    <div className="space-y-2 border-t border-slate-50 pt-8">
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] px-6 mb-4">Système</p>
                        <NavLink
                            to="/setup"
                            className={({ isActive }) => clsx(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-[13px] active-shrink group",
                                isActive
                                    ? "bg-emerald-50 text-emerald-900 border border-emerald-100"
                                    : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-900"
                            )}
                        >
                            <span className="material-symbols-outlined text-[22px] transition-all group-hover:rotate-45">settings</span>
                            <span>Configuration</span>
                        </NavLink>

                        <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-300 font-bold text-[13px] active-shrink group text-left"
                        >
                            <span className="material-symbols-outlined text-[22px] transition-all group-hover:rotate-12">power_settings_new</span>
                            <span>Déconnexion</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Modal */}
            <Modal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                title="Déconnexion"
            >
                <div className="text-center py-4">
                    <div className="w-20 h-20 bg-red-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 animate-float shadow-[inset_0_0_20px_rgba(239,68,68,0.05)] border border-red-100/50">
                        <span className="material-symbols-outlined text-red-500 text-4xl">logout</span>
                    </div>

                    <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Souhaitez-vous vous déconnecter ?</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-10 leading-relaxed">
                        Vous devrez sélectionner à nouveau <br /> votre boutique pour accéder aux données.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setShowLogoutConfirm(false)}
                            className="h-14 rounded-[24px] bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all active-shrink"
                        >
                            Non, Rester
                        </button>
                        <button
                            onClick={handleLogout}
                            className="h-14 rounded-[24px] bg-red-500 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all active-shrink"
                        >
                            Oui, Sortir
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
}
