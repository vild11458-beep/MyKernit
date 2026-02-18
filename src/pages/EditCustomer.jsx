import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getCustomer, updateCustomer } from '../db/db.js'
import { Layout } from '../components/ui/Layout.jsx'
import { Input } from '../components/ui/Input.jsx'
import { Button } from '../components/ui/Button.jsx'

export default function EditCustomer() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
        async function load() {
            const c = await getCustomer(id)
            if (c) {
                setName(c.name)
                setPhone(c.phone || '')
            }
        }
        load()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name.trim()) return

        setLoading(true)
        try {
            await updateCustomer(id, { name, phone })
            navigate(`/customer/${id}`)
        } catch (err) {
            console.error(err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={`transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
            <Layout>
                <header className="px-10 py-5 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-slate-100 shrink-0 sticky top-0 z-30 animate-fade-in-up">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full text-slate-300 hover:text-emerald-900 hover:bg-emerald-50 transition-all active-shrink">
                            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                        </button>
                        <div className="h-4 w-px bg-slate-100 mx-2"></div>
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Ressources</span>
                        <span className="text-slate-200 text-xs">/</span>
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">Modifier Fiche</span>
                    </div>
                </header>

                <main className="flex-1 w-full flex items-center justify-center p-10 bg-[#F8F9F5]">
                    <div className="w-full max-w-xl bg-white border border-slate-100 rounded-[40px] p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] animate-scale-in">
                        <div className="mb-10 text-center">
                            <div className="w-20 h-20 bg-emerald-900/[0.03] rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float">
                                <span className="material-symbols-outlined text-emerald-900 text-4xl">edit_square</span>
                            </div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight mb-2 italic">Mettre à jour</h1>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                                Modifiez les informations de {name || 'ce client'}.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-up">
                            <Input
                                label="Nom complet"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon="person"
                                required
                            />

                            <Input
                                label="Numéro de téléphone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                icon="call"
                            />

                            {error && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-[10px] font-black uppercase tracking-widest text-center">
                                    {error}
                                </div>
                            )}

                            <div className="pt-8">
                                <Button
                                    fullWidth
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    icon="save"
                                    className="h-16 rounded-[40px] bg-emerald-900 text-white font-black shadow-xl shadow-emerald-900/20 uppercase tracking-[0.2em] text-xs hover:bg-emerald-950 transition-all active-shrink"
                                >
                                    {loading ? 'Mise à jour...' : 'Sauvegarder les changements'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </main>
            </Layout>
        </div>
    )
}
