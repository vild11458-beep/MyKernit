import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCustomer } from '../hooks/index.js'
import { addTransaction, deleteCustomer } from '../db/db.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Layout } from '../components/ui/Layout.jsx'
import { Modal } from '../components/ui/Modal.jsx'
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx'
import { Input } from '../components/ui/Input.jsx'
import { clsx } from 'clsx'

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { customer, transactions } = useCustomer(id)
  const { shopID } = useAuth()
  const [showAddDebt, setShowAddDebt] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!customer) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen bg-[#F8F9F5]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-900"></div>
        </div>
      </Layout>
    )
  }

  const handleTransaction = async (type) => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Montant invalide')
      return
    }

    setLoading(true)
    try {
      await addTransaction(
        customer.id,
        shopID,
        parseFloat(amount),
        type,
        note
      )
      setAmount('')
      setNote('')
      setShowAddDebt(false)
      setShowPayment(false)
    } catch (error) {
      console.error('Error adding transaction:', error)
      alert('Erreur: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setShowConfirmDelete(false)
    try {
      await deleteCustomer(id)
      navigate('/dashboard')
    } catch (error) {
      alert('Erreur lors de la suppression: ' + error.message)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-DZ', {
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-DZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className={`transition-all duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
      <Layout>
        {/* Top Header Bar - NORDIC LIGHT */}
        <header className="px-10 py-5 flex justify-between items-center bg-white/40 backdrop-blur-md border-b border-slate-100 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-2 animate-fade-in-up">
            <button onClick={() => navigate('/dashboard')} className="w-9 h-9 flex items-center justify-center rounded-full text-slate-300 hover:text-emerald-900 hover:bg-emerald-50 transition-all active-shrink">
              <span className="material-symbols-outlined text-[24px]">arrow_back</span>
            </button>
            <div className="h-4 w-px bg-slate-100 mx-2"></div>
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Clients</span>
            <span className="text-slate-200 text-xs">/</span>
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em]">{customer.name}</span>
          </div>

          <div className="flex gap-2 animate-fade-in-up">
            <button
              onClick={() => navigate(`/edit-customer/${id}`)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-emerald-900 hover:border-emerald-900/20 transition-all active-shrink group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:rotate-12">edit</span>
            </button>
            <button
              onClick={() => setShowConfirmDelete(true)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-100 text-slate-300 hover:text-red-500 hover:border-red-100 transition-all active-shrink group"
            >
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110">delete</span>
            </button>
          </div>
        </header>

        <main className="flex-1 w-full px-10 py-8 overflow-y-auto bg-[#F8F9F5]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar: Profile & Actions - NORDIC LIGHT */}
            <div className="lg:col-span-4 space-y-6 animate-fade-in-up">
              <section className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] flex flex-col items-center">
                <div className="relative group mb-8">
                  <div className="w-28 h-28 rounded-[40px] bg-slate-50 border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105 group-hover:rotate-3">
                    <span className="text-4xl font-black text-slate-200 group-hover:text-emerald-900 transition-colors leading-none select-none uppercase">
                      {customer.name.substring(0, 2)}
                    </span>
                  </div>
                </div>

                <div className="text-center mb-10 w-full">
                  <h2 className="text-2xl font-black text-slate-900 leading-tight mb-2 truncate">{customer.name}</h2>
                  <div className="flex items-center justify-center gap-2 group cursor-pointer" onClick={() => window.open(`tel:${customer.phone}`)}>
                    <span className="material-symbols-outlined text-slate-300 text-base group-hover:text-emerald-900 transition-colors">phone_iphone</span>
                    <p className="text-[11px] font-bold text-slate-400 tracking-widest uppercase group-hover:text-slate-600 transition-colors">{customer.phone || 'Aucun numéro'}</p>
                  </div>
                </div>

                <div className="w-full pt-10 border-t border-slate-50 text-center">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4 italic">SOLDE ACTUEL</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className={`text-5xl font-black tracking-tighter ${customer.currentBalance > 0 ? 'text-red-500' : 'text-emerald-900'}`}>
                      {formatCurrency(Math.abs(customer.currentBalance))}
                    </span>
                    <span className="text-sm font-black text-slate-200 uppercase">DZD</span>
                  </div>
                </div>

                <div className="w-full mt-10 grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setShowAddDebt(true)}
                    className="flex flex-col items-center gap-3 p-5 bg-red-50 text-red-500 rounded-3xl border border-red-100 hover:bg-red-100 transition-all active-shrink group"
                  >
                    <span className="material-symbols-outlined text-2xl group-hover:animate-bounce">add_shopping_cart</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Ajouter Dette</span>
                  </button>
                  <button
                    onClick={() => setShowPayment(true)}
                    className="flex flex-col items-center gap-3 p-5 bg-emerald-50 text-emerald-900 rounded-3xl border border-emerald-100 hover:bg-emerald-100 transition-all active-shrink group"
                  >
                    <span className="material-symbols-outlined text-2xl group-hover:animate-pulse">payments</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Règlement</span>
                  </button>
                </div>
              </section>

              <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] stagger-1">
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-6">Statistiques Client</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center group">
                    <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wider">Total Opérations</span>
                    <span className="px-3 py-1 bg-slate-50 rounded-full text-[11px] font-black text-slate-900 border border-slate-100">{transactions.length}</span>
                  </div>
                  <div className="flex justify-between items-center group">
                    <span className="text-[11px] font-medium text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wider">Dernier mouvement</span>
                    <span className="text-[11px] font-black text-slate-950">
                      {transactions[0] ? formatDate(transactions[0].timestamp) : '-'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Area: Journal - NORDIC LIGHT */}
            <div className="lg:col-span-8 animate-fade-in-up stagger-1">
              <section className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.03)] min-h-[600px]">
                <div className="flex justify-between items-center mb-10 px-2">
                  <div className="flex items-center gap-4">
                    <span className="w-1 h-6 bg-emerald-900 rounded-full animate-pulse"></span>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-200 italic">Journal des Opérations</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {transactions.length === 0 ? (
                    <div className="text-center py-32 opacity-10 animate-pulse">
                      <span className="material-symbols-outlined text-[100px] text-slate-200 mb-6">history_edu</span>
                      <p className="font-black uppercase tracking-widest text-xs">Aucun mouvement enregistré</p>
                    </div>
                  ) : (
                    transactions.map((trans, idx) => (
                      <div
                        key={trans.id}
                        style={{ animationDelay: `${idx * 50}ms` }}
                        className="flex items-center justify-between p-6 rounded-[28px] border border-slate-50 hover:bg-slate-50 hover:border-emerald-100/50 transition-all duration-300 group animate-fade-in-up"
                      >
                        <div className="flex items-center gap-6">
                          <div className={clsx(
                            "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                            trans.type === 'debt' ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-900'
                          )}>
                            <span className="material-symbols-outlined text-[20px]">
                              {trans.type === 'debt' ? 'receipt_long' : 'payments'}
                            </span>
                          </div>
                          <div>
                            <p className="font-black text-sm text-slate-900 leading-none mb-1.5 group-hover:text-emerald-900 transition-colors">
                              {trans.type === 'debt' ? (trans.note || 'Achat à Crédit') : (trans.note || 'Versement')}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {formatDate(trans.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="flex items-baseline gap-1.5 transition-all duration-300 group-hover:scale-105">
                            <span className={clsx(
                              "text-xl font-black tracking-tighter",
                              trans.type === 'debt' ? 'text-red-500' : 'text-emerald-900'
                            )}>
                              {trans.type === 'debt' ? '+' : '-'}{formatCurrency(trans.amount)}
                            </span>
                            <span className="text-[9px] font-black text-slate-200 uppercase">DZD</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>

        <Modal
          isOpen={showAddDebt}
          onClose={() => setShowAddDebt(false)}
          title="Nouvelle Dette"
        >
          <div className="space-y-8 p-1">
            <Input
              label="Montant (DZD)"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              icon="monetization_on"
              autoFocus
            />
            <Input
              label="Détails"
              placeholder="Ex: Facture #12..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              icon="edit_note"
            />
            <div className="pt-4">
              <button
                onClick={() => handleTransaction('debt')}
                disabled={loading}
                className="w-full h-16 rounded-[40px] bg-slate-950 text-white font-black shadow-xl shadow-slate-900/20 active-shrink uppercase tracking-[0.2em] text-xs hover:bg-emerald-900 transition-all font-black"
              >
                {loading ? 'Validation...' : 'Valider la Dette'}
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={showPayment}
          onClose={() => setShowPayment(false)}
          title="Percevoir Règlement"
        >
          <div className="space-y-8 p-1">
            <Input
              label="Montant perçu"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              icon="payments"
              autoFocus
            />
            <Input
              label="Note"
              placeholder="Versement du jour..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              icon="edit_note"
            />
            <div className="pt-4">
              <button
                onClick={() => handleTransaction('payment')}
                disabled={loading}
                className="w-full h-16 rounded-[40px] bg-emerald-900 text-white font-black shadow-xl shadow-emerald-900/20 active-shrink uppercase tracking-[0.2em] text-xs hover:bg-emerald-950 transition-all font-black"
              >
                {loading ? 'Traitement...' : 'Confirmer Règlement'}
              </button>
            </div>
          </div>
        </Modal>

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={showConfirmDelete}
          onConfirm={handleDelete}
          onCancel={() => setShowConfirmDelete(false)}
          title={`Supprimer le dossier de ${customer?.name}?`}
          message={`Cette action supprimera le dossier client et toutes les transactions associées.\n\nCette action est irréversible.`}
          confirmText="Supprimer"
          isDangerous={true}
        />
      </Layout>
    </div>
  )
}
