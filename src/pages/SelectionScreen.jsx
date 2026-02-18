import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Logo } from '../components/ui/Logo.jsx'
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx'

export default function SelectionScreen() {
    const navigate = useNavigate()
    const { allShops, selectShop, deleteShop } = useAuth()
    const [isMounted, setIsMounted] = useState(false)
    const [isFading, setIsFading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [deletingShopId, setDeletingShopId] = useState(null)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [deleteConfirmData, setDeleteConfirmData] = useState(null)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const handleSelect = async (id) => {
        setIsFading(true)
        await new Promise(resolve => setTimeout(resolve, 400))
        const success = await selectShop(id)
        if (success) {
            navigate('/dashboard', { replace: true })
        } else {
            setIsFading(false)
            alert('Impossible de charger cette boutique.')
        }
    }

    const handleDelete = async (e, shopId, shopName) => {
        e.stopPropagation() // Prevent shop selection when clicking delete
        
        setDeleteConfirmData({ shopId, shopName })
        setShowConfirmDelete(true)
    }

    const handleConfirmDelete = async () => {
        if (!deleteConfirmData) return
        
        const { shopId } = deleteConfirmData
        setShowConfirmDelete(false)
        setDeletingShopId(shopId)
        
        const success = await deleteShop(shopId)
        
        if (success) {
            // Success feedback (the shop will disappear from list automatically)
            console.log('✓ Shop deleted successfully')
        } else {
            alert('Erreur lors de la suppression de la boutique.')
        }
        
        setDeletingShopId(null)
        setDeleteConfirmData(null)
    }

    // Group shops by owner name
    const groupedShops = useMemo(() => {
        if (!allShops) return {}
        const filtered = allShops.filter(s =>
            s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (s.ownerName && s.ownerName.toLowerCase().includes(searchTerm.toLowerCase()))
        )

        const groups = {}
        filtered.forEach(shop => {
            const owner = shop.ownerName || 'Boutiques Indépendantes'
            if (!groups[owner]) groups[owner] = []
            groups[owner].push(shop)
        })
        return groups
    }, [allShops, searchTerm])

    return (
        <div className={`transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'} ${isFading ? 'opacity-0 scale-95 blur-sm' : ''}`}>
            <div className="min-h-screen w-full bg-[#F8F9F5] flex flex-col items-center p-6 sm:p-10 font-sans relative overflow-x-hidden">
                {/* Decorative background blurs - NORDIC LIGHT */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-900/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-900/[0.03] rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/2"></div>

                <div className="w-full max-w-2xl relative z-10 pt-12 pb-20">
                    {/* Header Section with OFFICIAL LOGO */}
                    <div className="mb-12 text-center animate-fade-in-up">
                        <div className="flex justify-center mb-12">
                            <div className="relative group">
                                <div className="absolute inset-0 bg-emerald-500/10 blur-[80px] rounded-full scale-150 transition-opacity duration-1000 group-hover:opacity-100"></div>
                                <Logo className="w-32 h-32 relative z-10 transition-all duration-700 group-hover:scale-105" showText={false} />
                            </div>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 mb-3 italic">
                            My Kernit <span className="text-emerald-900">Pro</span>
                        </h1>
                        <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em]">
                            Sélectionnez votre espace de gestion
                        </p>
                    </div>

                    {/* Search Field - PREMIUM LIGHT */}
                    <div className="mb-10 animate-fade-in-up stagger-1">
                        <div className="relative group">
                            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-900 transition-colors">
                                <span className="material-symbols-outlined text-[24px]">search</span>
                            </span>
                            <input
                                type="text"
                                placeholder="Chercher par boutique ou propriétaire..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full h-16 pl-16 pr-8 bg-white border border-slate-100 rounded-[28px] shadow-sm focus:ring-8 focus:ring-emerald-900/5 focus:border-emerald-900/10 transition-all outline-none font-bold text-slate-900 placeholder:text-slate-200 placeholder:font-normal"
                            />
                        </div>
                    </div>

                    {/* Shop Selection Area grouped by Owner */}
                    <div className="space-y-12 animate-scale-in">
                        {!allShops ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
                            </div>
                        ) : allShops.length === 0 ? (
                            <div className="text-center py-20 bg-white border border-slate-100 rounded-[48px] shadow-sm">
                                <span className="material-symbols-outlined text-slate-100 text-6xl mb-4">storefront</span>
                                <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                                    Aucune boutique configurée <br /> sur cet appareil
                                </p>
                            </div>
                        ) : (
                            Object.entries(groupedShops).map(([owner, shops], gIdx) => (
                                <div key={owner} className="animate-fade-in-up" style={{ animationDelay: `${gIdx * 150}ms` }}>
                                    <div className="flex items-center gap-4 mb-6 px-6">
                                        <div className="w-1.5 h-6 bg-emerald-900 rounded-full shadow-[0_0_12px_rgba(6,78,59,0.1)]"></div>
                                        <h2 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] italic">{owner}</h2>
                                        <div className="h-px flex-1 bg-slate-100"></div>
                                        <span className="text-[9px] font-black text-slate-300 uppercase">{shops.length} Boutiques</span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                                        {shops.map((shop, idx) => (
                                            <div key={shop.id} className="relative group">
                                                <button
                                                    onClick={() => handleSelect(shop.id)}
                                                    disabled={deletingShopId === shop.id}
                                                    className="flex items-center gap-5 p-5 pr-16 bg-white border border-slate-100 rounded-[32px] hover:border-emerald-900/30 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.05)] hover:-translate-y-1 transition-all duration-300 active-shrink group text-left h-full w-full disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-[20px] flex items-center justify-center text-slate-200 shadow-inner group-hover:bg-emerald-900 group-hover:text-white transition-all">
                                                        <span className="material-symbols-outlined text-[24px]">store</span>
                                                    </div>
                                                    <div className="flex-1 overflow-hidden">
                                                        <h3 className="font-black text-slate-900 group-hover:text-emerald-950 transition-colors truncate">{shop.name}</h3>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{shop.city}</span>
                                                            <div className="w-1 h-1 rounded-full bg-slate-100"></div>
                                                            <span className="text-[9px] font-black text-emerald-900/30 uppercase tracking-widest">{shop.category}</span>
                                                        </div>
                                                    </div>
                                                    <span className="material-symbols-outlined text-slate-100 group-hover:text-emerald-950 transition-colors">chevron_right</span>
                                                </button>
                                                
                                                {/* Delete Button */}
                                                <button
                                                    onClick={(e) => handleDelete(e, shop.id, shop.name)}
                                                    disabled={deletingShopId === shop.id}
                                                    className="absolute -top-2 -right-2 w-10 h-10 bg-red-50 hover:bg-red-500 border-2 border-white hover:border-red-500 rounded-full flex items-center justify-center text-red-400 hover:text-white transition-all duration-200 active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed z-20 shadow-md hover:shadow-lg group-hover:shadow-[0_8px_16px_rgba(239,68,68,0.2)]"
                                                    title="Supprimer cette boutique"
                                                >
                                                    {deletingShopId === shop.id ? (
                                                        <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                                    ) : (
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col items-center animate-fade-in-up stagger-3">
                        <button
                            onClick={() => navigate('/setup')}
                            className="w-full max-w-md h-16 bg-emerald-900 text-white rounded-[40px] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-4 shadow-xl shadow-emerald-900/20 hover:bg-emerald-950 transition-all active-shrink"
                        >
                            <span className="material-symbols-outlined text-[20px]">add_business</span>
                            Nouvelle Boutique
                        </button>

                        <p className="mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] italic">
                            Chiffrement Local Dexie-JS • My Kernit 2026
                        </p>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmDialog
                isOpen={showConfirmDelete}
                onConfirm={handleConfirmDelete}
                onCancel={() => {
                    setShowConfirmDelete(false)
                    setDeleteConfirmData(null)
                }}
                title={`Supprimer "${deleteConfirmData?.shopName}"?`}
                message={`Cette action supprimera:\n- La boutique\n- Tous les clients\n- Toutes les transactions\n\nCette action est irréversible.`}
                confirmText="Supprimer"
                isDangerous={true}
            />
        </div>
    )
}
