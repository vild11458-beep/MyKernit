import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx'
import { initializeDatabase } from './db/db.js'
import { ErrorBoundary } from './components/ui/ErrorBoundary.jsx'
import { AnimatePresence, motion } from 'framer-motion'

// Pages
import SelectionScreen from './pages/SelectionScreen.jsx'
import SetupScreen from './pages/SetupScreen.jsx'
import Dashboard from './pages/Dashboard.jsx'
import CustomerDetail from './pages/CustomerDetail.jsx'
import AddCustomer from './pages/AddCustomer.jsx'
import EditCustomer from './pages/EditCustomer.jsx'
import Reports from './pages/Reports.jsx'

/**
 * Modern Page Transition Wrapper
 */
const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.99 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] // Custom quintic-like easing for premium feel
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}

/**
 * Main App Routes with sophisticated transitions
 */
function AppRoutes() {
  const { loading, shopExists } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9F5]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-900/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-900 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.4em] animate-pulse">Initialisation du Système</p>
        </div>
      </div>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/selection"
          element={
            <PageTransition>
              {shopExists ? <Navigate to="/dashboard" replace /> : <SelectionScreen />}
            </PageTransition>
          }
        />
        <Route
          path="/setup"
          element={
            <PageTransition>
              <SetupScreen />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              {shopExists ? <Dashboard /> : <Navigate to="/selection" replace />}
            </PageTransition>
          }
        />
        <Route
          path="/reports"
          element={
            <PageTransition>
              {shopExists ? <Reports /> : <Navigate to="/selection" replace />}
            </PageTransition>
          }
        />
        <Route
          path="/customer/:id"
          element={
            <PageTransition>
              {shopExists ? <CustomerDetail /> : <Navigate to="/selection" replace />}
            </PageTransition>
          }
        />
        <Route
          path="/add-customer"
          element={
            <PageTransition>
              {shopExists ? <AddCustomer /> : <Navigate to="/selection" replace />}
            </PageTransition>
          }
        />
        <Route
          path="/edit-customer/:id"
          element={
            <PageTransition>
              {shopExists ? <EditCustomer /> : <Navigate to="/selection" replace />}
            </PageTransition>
          }
        />
        <Route
          path="/"
          element={<Navigate to={shopExists ? "/dashboard" : "/selection"} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={shopExists ? "/dashboard" : "/selection"} replace />}
        />
      </Routes>
    </AnimatePresence>
  )
}


/**
 * Main App component
 */
function App() {
  const [dbReady, setDbReady] = useState(false)

  useEffect(() => {
    initializeDatabase()
      .then(() => {
        setDbReady(true)
      })
      .catch((error) => {
        console.error('✗ Database initialization failed:', error)
        setDbReady(true)
      })
  }, [])

  if (!dbReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8F9F5]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-900"></div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
