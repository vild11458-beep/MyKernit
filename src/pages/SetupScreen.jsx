import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext.jsx'
import { shopsTable } from '../db/db.js'
import { Input } from '../components/ui/Input.jsx'
import { Logo } from '../components/ui/Logo.jsx'

export default function SetupScreen() {
    const navigate = useNavigate()
    const { shopID, checkShopStatus, refreshShopsList } = useAuth()
    const [shopData, setShopData] = useState(null)
    const [isMounted, setIsMounted] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        city: 'Biskra',
        ownerName: ''
    })

    const [loading, setLoading] = useState(false)
    const [isFading, setIsFading] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        async function loadShop() {
            if (shopID) {
                const shop = await shopsTable.get(shopID)
                if (shop) {
                    setFormData({
                        name: shop.name,
                        category: shop.category || '',
                        city: shop.city || 'Biskra',
                        ownerName: shop.ownerName || ''
                    })
                    setShopData(shop)
                }
            }
        }
        loadShop()
    }, [shopID])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!formData.name || !formData.category || !formData.ownerName) {
            alert('Veuillez remplir tous les champs obligatoires, y compris le nom du propriétaire.')
            return
        }

        setLoading(true)

        try {
            const finalShopID = shopID || Math.random().toString(36).substring(2, 11)

            await shopsTable.put({
                id: finalShopID,
                name: formData.name,
                category: formData.category,
                city: formData.city,
                ownerName: formData.ownerName,
                createdAt: shopData?.createdAt || Date.now()
            })

            await refreshShopsList()
            setIsFading(true)
            await new Promise(resolve => setTimeout(resolve, 400))
            await checkShopStatus(finalShopID)
            navigate('/dashboard', { replace: true })
        } catch (error) {
            console.error('✗ Failed to save shop:', error)
            alert(`Erreur: ${error.message || 'Echec de sauvegarde'}`)
            setLoading(false)
            setIsFading(false)
        }
    }

    return (
        <div className={`min-h-screen bg-[#F8F9F5] transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'} ${isFading ? 'opacity-0 scale-95' : ''} relative flex flex-col items-center justify-center p-6 sm:p-10 font-sans overflow-hidden`}>
            {/* Background Blurs - Nordic Theme */}
            <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-900/[0.03] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -translate-x-1/2"></div>
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-900/[0.03] rounded-full blur-[100px] pointer-events-none translate-y-1/2 translate-x-1/2"></div>

            {/* Back Button */}
            <div className="absolute top-10 left-10 animate-fade-in-up">
                <button
                    onClick={() => navigate(-1)}
                    className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-300 hover:text-emerald-900 hover:border-emerald-900/20 transition-all active-shrink shadow-sm group"
                >
                    <span className="material-symbols-outlined text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
                </button>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Header with OFFICIAL LOGO */}
                <div className="mb-12 text-center animate-fade-in-up">
                    <div className="flex justify-center mb-10">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full scale-150 transition-opacity duration-1000 group-hover:opacity-100"></div>
                            <Logo className="w-24 h-24 relative z-10 transition-transform duration-700 hover:rotate-2" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 italic">
                        {shopID ? 'Paramètres' : 'Nouvelle Boutique'}
                    </h1>
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-[0.3em] max-w-sm mx-auto">
                        Configurez votre espace de gestion local
                    </p>
                </div>

                {/* Form Container - Nordic Light */}
                <form onSubmit={handleSubmit} className="bg-white border border-slate-100 rounded-[48px] p-10 sm:p-14 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.05)] animate-scale-in">
                    <div className="space-y-10">
                        <Input
                            label="Nom du Propriétaire"
                            placeholder="Ex: Ahmed Biskri"
                            value={formData.ownerName}
                            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                            icon="person"
                            required
                        />

                        <Input
                            label="Nom de la Boutique"
                            placeholder="Ex: Supérette El Mokhtar"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            icon="store"
                            required
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-6 italic">
                                    Catégorie
                                </label>
                                <div className="relative group">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-900 transition-colors">
                                        <span className="material-symbols-outlined text-[22px]">category</span>
                                    </span>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full h-16 pl-16 pr-12 bg-slate-50 border border-slate-100 rounded-[22px] focus:ring-8 focus:ring-emerald-900/5 focus:border-emerald-900/10 focus:bg-white outline-none appearance-none transition-all text-sm font-bold text-slate-900 shadow-sm"
                                        required
                                    >
                                        <option value="" disabled>Spécialité</option>
                                        <option value="alimentation">Alimentation</option>
                                        <option value="boucherie">Boucherie</option>
                                        <option value="quincaillerie">Quincaillerie</option>
                                        <option value="cosmetique">Cosmétique</option>
                                        <option value="autre">Autre</option>
                                    </select>
                                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none group-focus-within:text-emerald-900 transition-colors">
                                        <span className="material-symbols-outlined">expand_more</span>
                                    </span>
                                </div>
                            </div>

                            <Input
                                label="Ville"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                icon="location_on"
                                required
                            />
                        </div>

                        {/* Submit Button - Forest Green */}
                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full h-16 bg-emerald-900 text-white rounded-[40px] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl shadow-emerald-900/20 hover:bg-emerald-950 transition-all active-shrink disabled:opacity-50"
                            >
                                {loading ? 'Enregistrement...' : 'Confirmer les Paramètres'}
                                <span className="material-symbols-outlined text-[20px] font-black">check_circle</span>
                            </button>
                        </div>
                    </div>
                </form>

                <p className="mt-12 text-center text-[9px] font-black text-slate-300 uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">
                    Vos données sont stockées <br /> uniquement sur ce navigateur
                </p>
            </div>
        </div>
    )
}
