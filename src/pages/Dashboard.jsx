import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useCustomers, useAllTransactions, useShop } from '../hooks/index.js'
import { Layout } from '../components/ui/Layout.jsx'
import { updateShop } from '../db/db.js'
import { clsx } from 'clsx'

export default function Dashboard() {
  const navigate = useNavigate()
  const { shopID } = useAuth()
  const shop = useShop() // Fixed: Fetch shop data using hook
  const customers = useCustomers()
  const transactions = useAllTransactions()

  const [searchTerm, setSearchTerm] = useState('')
  const [isEditingAccount, setIsEditingAccount] = useState(false)
  const [tempOwnerName, setTempOwnerName] = useState('')
  const [tempCity, setTempCity] = useState('')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    if (shop) {
      setTempOwnerName(shop.ownerName || '')
      setTempCity(shop.city || 'Biskra')
    }
  }, [shop])

  const stats = useMemo(() => {
    if (!customers) return { totalDehors: 0, riskCount: 0 }
    const totalDehors = customers.reduce((sum, c) => sum + (c.currentBalance || 0), 0)
    const riskCount = customers.filter(c => (c.currentBalance || 0) > 50000).length
    return { totalDehors, riskCount }
  }, [customers])

  const filteredCustomers = useMemo(() => {
    if (!customers) return []
    return customers
      .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (b.currentBalance || 0) - (a.currentBalance || 0))
  }, [customers, searchTerm])

  const handleUpdateAccount = async () => {
    if (tempOwnerName.trim() && tempCity.trim()) {
      await updateShop(shopID, {
        ownerName: tempOwnerName.trim(),
        city: tempCity.trim()
      })
      setIsEditingAccount(false)
    }
  }

  const formatCurrency = (val) => new Intl.NumberFormat('fr-DZ').format(val)
  const isHighDebt = stats.totalDehors > 100000

  return (
    <div className={`transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <Layout>
        {/* REFINED HEADER - Fixed Top Right */}
        <header className="px-12 py-6 flex justify-between items-center bg-white/60 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-100/50">
          <div className="flex flex-col animate-fade-in-up">
            <div className="flex items-center gap-3">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em]">Dashboard</span>
              <span className="text-emerald-950/10 text-xs">/</span>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-black text-emerald-900 uppercase tracking-[0.4em] italic">{shop?.name || 'Chargement...'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 animate-fade-in-up">
            {/* Account Details View */}
            {!isEditingAccount ? (
              <button
                onClick={() => setIsEditingAccount(true)}
                className="flex items-center gap-4 pl-6 pr-2 py-2 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl hover:bg-emerald-100/50 transition-all group active-shrink shadow-sm"
              >
                <div className="text-right">
                  <p className="text-[10px] font-black text-emerald-950 tracking-widest uppercase leading-none mb-1.5 italic">
                    {shop?.ownerName || 'Propriétaire'}
                  </p>
                  <div className="flex items-center justify-end gap-1.5 opacity-60">
                    <span className="text-[8px] font-black text-emerald-800 uppercase tracking-widest leading-none">Admin Connecté</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-900 flex items-center justify-center text-white shadow-lg shadow-emerald-900/10 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-emerald-900/10 shadow-2xl animate-scale-in">
                <div className="flex items-center gap-2 px-3">
                  <span className="material-symbols-outlined text-emerald-900/20 text-lg">edit</span>
                  <input
                    value={tempOwnerName}
                    onChange={(e) => setTempOwnerName(e.target.value)}
                    placeholder="Gérant..."
                    className="bg-transparent text-emerald-950 font-bold text-xs outline-none w-28 placeholder:text-slate-200"
                  />
                  <div className="w-px h-4 bg-slate-100 mx-1"></div>
                  <input
                    value={tempCity}
                    onChange={(e) => setTempCity(e.target.value)}
                    placeholder="Ville..."
                    className="bg-transparent text-emerald-950 font-bold text-xs outline-none w-24 placeholder:text-slate-200"
                  />
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={handleUpdateAccount}
                    className="bg-emerald-900 text-white h-10 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-emerald-950 active-shrink shadow-lg shadow-emerald-900/10"
                  >
                    Sauver
                  </button>
                  <button
                    onClick={() => setIsEditingAccount(false)}
                    className="w-10 h-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 w-full px-12 py-10 bg-[#F8F9F5]">
          {/* HERO BANNER - REDESIGNED */}
          <section className="relative bg-white rounded-[56px] p-12 lg:p-16 overflow-hidden mb-16 border border-slate-100 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.03)] animate-scale-in">
            <div className="absolute top-[-30%] right-[-5%] w-[600px] h-[600px] bg-emerald-900/[0.04] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-16">
              <div className="flex-1">
                <div className="inline-flex items-center gap-3 bg-emerald-50 text-emerald-900/60 px-5 py-2.5 rounded-full mb-10 border border-emerald-100/50">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Système Certifié My Kernit</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-emerald-950 mb-8 tracking-tighter leading-[1.05]">
                  Pilotez votre commerce <br className="hidden lg:block" />
                  <span className="text-emerald-900/20 italic font-medium tracking-tight">avec une précision</span> totale.
                </h1>

                {/* Search & Add Action Bar */}
                <div className="flex flex-col md:flex-row items-center gap-4 mt-12 w-full max-w-3xl">
                  <div className="relative group flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-10 flex items-center pointer-events-none text-slate-300 group-focus-within:text-emerald-900 transition-colors">
                      <span className="material-symbols-outlined text-[26px]">search</span>
                    </div>
                    <input
                      className="w-full h-20 bg-slate-50 border border-slate-100 rounded-[32px] pl-28 pr-8 focus:ring-8 focus:ring-emerald-900/5 focus:border-emerald-900/30 focus:bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] text-base font-bold text-slate-900 placeholder:text-slate-300 transition-all outline-none"
                      placeholder="Trouver un client..."
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => navigate('/add-customer')}
                    className="h-20 bg-emerald-900 text-white px-12 rounded-[32px] text-[11px] font-black uppercase tracking-widest hover:bg-emerald-950 shadow-2xl shadow-emerald-900/20 transition-all active-shrink whitespace-nowrap flex items-center justify-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center transition-transform group-hover:rotate-12">
                      <span className="material-symbols-outlined text-[24px]">person_add</span>
                    </div>
                    <span>Nouveau Client</span>
                  </button>
                </div>
              </div>

              {/* BALANCE CARD - INTEGRATED & PREMIUM */}
              <div className="xl:w-96 shrink-0 animate-scale-in stagger-3">
                <div className="bg-emerald-950 rounded-[52px] p-12 shadow-[0_40px_80px_-20px_rgba(6,78,59,0.25)] flex flex-col items-center text-center group transition-all duration-500 hover:scale-[1.03] border border-emerald-900 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2"></div>

                  <div className="relative z-10 w-full">
                    <div className="flex items-center justify-center gap-2 mb-8 opacity-40">
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.4em] italic">Encours Total Client</span>
                    </div>

                    <div className="flex items-baseline justify-center gap-3 mb-10">
                      <span className="text-6xl font-black text-white tracking-tighter tabular-nums group-hover:scale-110 transition-transform duration-700">
                        {formatCurrency(stats.totalDehors)}
                      </span>
                      <span className="text-xl font-black text-emerald-800 uppercase">DZD</span>
                    </div>

                    <div className={clsx(
                      "group/pill w-full px-6 py-4 rounded-3xl flex items-center justify-center gap-3 border transition-all duration-500",
                      isHighDebt
                        ? "bg-red-500/10 border-red-500/20 text-red-400 shadow-[inset_0_0_20px_rgba(239,68,68,0.1)]"
                        : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[inset_0_0_20px_rgba(52,211,153,0.1)]"
                    )}>
                      <span className="material-symbols-outlined text-[20px] group-hover/pill:rotate-12 transition-transform">
                        {isHighDebt ? 'report' : 'verified'}
                      </span>
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] italic">
                        Santé: {isHighDebt ? 'Alerte Critique' : 'Gestion Excellente'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-px bg-white/5 rounded-3xl mt-10 overflow-hidden border border-white/5">
                      <div className="py-6 px-4 bg-emerald-950/40">
                        <p className="text-2xl font-black text-white mb-0.5">{customers?.length || 0}</p>
                        <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Actifs</p>
                      </div>
                      <div className="py-6 px-4 bg-emerald-950/40">
                        <p className={`text-2xl font-black mb-0.5 ${stats.riskCount > 0 ? 'text-red-400' : 'text-white'}`}>{stats.riskCount}</p>
                        <p className="text-[8px] font-black text-emerald-700 uppercase tracking-widest">Risques</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CUSTOMER GRID */}
          <div className="flex items-center justify-between mb-10 px-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-emerald-900 rounded-full animate-pulse"></div>
              <h2 className="text-[11px] font-black text-emerald-950 uppercase tracking-[0.5em] italic opacity-80">Annuaire des Engagements</h2>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none">{filteredCustomers.length} Clients trouvés</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {!customers ? (
              [...Array(8)].map((_, i) => (
                <div key={i} className="h-64 bg-white border border-slate-100 rounded-[44px] animate-pulse"></div>
              ))
            ) : filteredCustomers.map((c, idx) => (
              <button
                key={c.id}
                onClick={() => navigate(`/customer/${c.id}`)}
                className="group relative bg-white border border-slate-100 rounded-[44px] p-8 text-left hover:border-emerald-900/30 transition-all duration-500 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.06)] hover:-translate-y-2 active-shrink animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex justify-between items-start mb-8">
                  <div className="w-16 h-16 rounded-[22px] bg-slate-50 flex items-center justify-center text-xl font-black text-slate-200 group-hover:text-emerald-900 transition-all duration-500 group-hover:bg-emerald-50 group-hover:scale-110 group-hover:rotate-6 border border-slate-100/50">
                    {c.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div className={clsx(
                    "px-3 py-1.5 rounded-xl flex items-center gap-2 border text-[8px] font-black uppercase tracking-widest",
                    c.currentBalance > 0
                      ? "bg-red-50 border-red-100/50 text-red-500"
                      : "bg-emerald-50 border-emerald-100/50 text-emerald-900"
                  )}>
                    <span className="w-1 h-1 rounded-full bg-current"></span>
                    {c.currentBalance > 0 ? 'Dette Active' : 'Solvabilité'}
                  </div>
                </div>

                <h3 className="text-xl font-black text-emerald-950 tracking-tight leading-tight mb-2 group-hover:text-emerald-800 transition-colors truncate">
                  {c.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-10">
                  {c.phone || 'Aucun Contact'}
                </p>

                <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                  <div>
                    <p className="text-[8px] font-black text-slate-200 uppercase tracking-[0.2em] mb-1.5">Solde Courant</p>
                    <p className={`text-2xl font-black tracking-tighter ${c.currentBalance > 0 ? 'text-red-500' : 'text-emerald-950'}`}>
                      {formatCurrency(c.currentBalance)}
                    </p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-4 transition-all duration-500 group-hover:bg-emerald-900 group-hover:text-white shadow-xl shadow-emerald-900/10">
                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </main>
      </Layout>
    </div>
  )
}
