import { useMemo, useState, useEffect } from 'react'
import { useCustomers, useAllTransactions } from '../hooks/index.js'
import { Layout } from '../components/ui/Layout.jsx'

export default function Reports() {
    const customers = useCustomers()
    const transactions = useAllTransactions()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    // 1. Calculate Financial Breakdown (Month)
    const stats = useMemo(() => {
        // STABILITY GUARD
        if (!transactions || !customers) return { monthlyPayments: 0, monthlyDebt: 0, totalDehors: 0, collectionRatio: 100 }

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime()

        const monthlyPayments = transactions
            .filter(t => t.type === 'payment' && t.timestamp >= startOfMonth)
            .reduce((sum, t) => sum + t.amount, 0) || 0

        const monthlyDebt = transactions
            .filter(t => t.type === 'debt' && t.timestamp >= startOfMonth)
            .reduce((sum, t) => sum + t.amount, 0) || 0

        const totalDehors = customers.reduce((sum, c) => sum + (c.currentBalance || 0), 0) || 0

        const collectionRatio = monthlyDebt > 0 ? (monthlyPayments / monthlyDebt) * 100 : 100

        return { monthlyPayments, monthlyDebt, totalDehors, collectionRatio }
    }, [transactions, customers])

    // 2. Top Debtors
    const topDebtors = useMemo(() => {
        if (!customers) return []
        return [...customers]
            .sort((a, b) => (b.currentBalance || 0) - (a.currentBalance || 0))
            .slice(0, 5)
    }, [customers])

    // 3. Debt Distribution Zones
    const distribution = useMemo(() => {
        const zones = { low: 0, mid: 0, high: 0 }
        if (!customers) return zones
        customers.forEach(c => {
            const bal = c.currentBalance || 0
            if (bal < 10000) zones.low++
            else if (bal < 100000) zones.mid++
            else zones.high++
        })
        return zones
    }, [customers])

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-DZ', {
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className={`transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            <Layout>
                <header className="px-12 py-6 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
                    <div className="flex items-center gap-3 animate-fade-in-up">
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">ANALYSE</span>
                        <span className="text-slate-200 text-xs">/</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Tableau de Bord Stratégique</span>
                    </div>
                </header>

                <main className="flex-1 w-full px-12 py-10 bg-[#F8F9F5]">
                    <div className="max-w-7xl mx-auto space-y-10">

                        {/* 1. Header Metrics GRID - Nordic Theme */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in-up">
                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-emerald-900/10 transition-all duration-500 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-900/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Entrées du Mois</p>
                                    <h3 className="text-3xl font-black text-emerald-900 tracking-tighter">+{formatCurrency(stats.monthlyPayments)} <span className="text-xs uppercase font-bold text-slate-300">DZD</span></h3>
                                </div>
                                <div className="mt-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-emerald-900 rounded-full shadow-[0_0_12px_rgba(6,78,59,0.1)]"></span>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Liquidité perçue</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.02)] flex flex-col justify-between group hover:border-emerald-900/10 transition-all duration-500 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 italic">Crédits Accordés</p>
                                    <h3 className="text-3xl font-black text-red-500 tracking-tighter">+{formatCurrency(stats.monthlyDebt)} <span className="text-xs uppercase font-bold text-slate-300">DZD</span></h3>
                                </div>
                                <div className="mt-6 flex items-center gap-2">
                                    <span className="w-1.5 h-6 bg-red-500 rounded-full shadow-[0_0_12px_rgba(239,68,68,0.1)]"></span>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Nouvelles créances</p>
                                </div>
                            </div>

                            <div className="bg-emerald-900 rounded-[40px] p-8 shadow-[0_24px_48px_-12px_rgba(6,78,59,0.2)] flex flex-col justify-between group hover:scale-[1.02] transition-all duration-500 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div>
                                    <p className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em] mb-2 italic">Performance Recouvrement</p>
                                    <h3 className="text-4xl font-black text-white tracking-tighter">{Math.round(stats.collectionRatio)}%</h3>
                                </div>
                                <div className="mt-6">
                                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${Math.min(stats.collectionRatio, 100)}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                            {/* 2. Top Debtors List - Light Theme */}
                            <div className="lg:col-span-7 animate-fade-in-up stagger-1">
                                <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] min-h-[500px]">
                                    <div className="flex items-center justify-between mb-10">
                                        <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic border-l-4 border-emerald-900 pl-4">Priority Top 5 Debtors</h4>
                                        <span className="material-symbols-outlined text-slate-200">leaderboard</span>
                                    </div>

                                    {!customers ? (
                                        <div className="space-y-4">
                                            {[...Array(5)].map((_, i) => (
                                                <div key={i} className="h-24 bg-slate-50 rounded-[32px] animate-pulse"></div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {topDebtors.map((debtor, idx) => (
                                                <div key={debtor.id} className="flex items-center justify-between p-6 rounded-[32px] border border-slate-50 hover:bg-slate-50 hover:border-emerald-900/10 transition-all group">
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner transition-all group-hover:rotate-6
                                   ${idx === 0 ? 'bg-amber-100/50 text-amber-600' : idx === 1 ? 'bg-emerald-100/50 text-emerald-600' : 'bg-slate-100/50 text-slate-600'}`}>
                                                            #{idx + 1}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 leading-none group-hover:text-emerald-900 transition-colors">{debtor.name}</p>
                                                            <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-widest">{debtor.phone || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xl font-black text-red-500 tracking-tighter">{formatCurrency(debtor.currentBalance)}</p>
                                                        <p className="text-[9px] font-black text-slate-200 uppercase tracking-widest">DZD</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 3. Distribution & Health - Light Theme */}
                            <div className="lg:col-span-5 space-y-10 animate-fade-in-up stagger-2">
                                <div className="bg-white rounded-[48px] p-10 border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)]">
                                    <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] italic mb-10 border-l-4 border-emerald-900 pl-4">Distribution du Risque</h4>
                                    <div className="space-y-6">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Zone Rouge (&gt; 10 Millions)</span>
                                                <span className="text-xs font-black text-red-500">{distribution.high} clients</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${(distribution.high / (customers?.length || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Zone Orange (1M - 10M)</span>
                                                <span className="text-xs font-black text-amber-500">{distribution.mid} clients</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${(distribution.mid / (customers?.length || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-between items-end">
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Zone Verte (&lt; 1 Million)</span>
                                                <span className="text-xs font-black text-emerald-600">{distribution.low} clients</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-emerald-600 transition-all duration-1000" style={{ width: `${(distribution.low / (customers?.length || 1)) * 100}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-emerald-900 rounded-[48px] p-10 text-white shadow-[0_24px_48px_-12px_rgba(6,78,59,0.2)] group hover:scale-[1.02] transition-all duration-500">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                            <span className="material-symbols-outlined text-white">insights</span>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-100/40 uppercase tracking-[0.2em] italic">Statut Global</p>
                                            <h4 className="text-xl font-black tracking-tight leading-none mt-1 text-white">
                                                {stats.collectionRatio > 50 ? 'Croissance Saine' : 'Attention Requise'}
                                            </h4>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-emerald-100/60 leading-relaxed uppercase tracking-wider">
                                        {stats.collectionRatio > 50
                                            ? 'Votre taux de recouvrement est solide. Continuez vos efforts sur les nouveaux crédits.'
                                            : 'Vos attributions de crédit dépassent vos revenus. Un suivi rigoureux du Top 5 est recommandé.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </Layout>
        </div>
    )
}
