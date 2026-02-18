import { useState, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { customersTable, transactionsTable, shopsTable } from '../db/db.js'
import { useAuth } from '../contexts/AuthContext.jsx'

/**
 * Hook: Get all customers for the logged-in shop
 * Lives from Dexie via useLiveQuery (real-time updates)
 */
export function useCustomers() {
  const { shopID } = useAuth()

  const customers = useLiveQuery(
    async () => {
      if (!shopID) return []
      return await customersTable
        .where('shopID')
        .equals(shopID)
        .toArray()
    },
    [shopID]
  )

  return customers
}

/**
 * Hook: Get a specific customer and their transactions
 */
export function useCustomer(customerID) {
  const { shopID } = useAuth()

  const customer = useLiveQuery(
    async () => {
      if (!customerID || !shopID) return null
      return await customersTable.get(customerID)
    },
    [customerID, shopID]
  )

  const transactions = useLiveQuery(
    async () => {
      if (!customerID || !shopID) return []
      return await transactionsTable
        .where('customerID')
        .equals(customerID)
        .reverse()
        .sortBy('timestamp')
    },
    [customerID, shopID]
  )

  return {
    customer: customer || null,
    transactions: transactions || [],
  }
}

/**
 * Hook: Get all transactions for the current shop
 * Used for statistics and reporting
 */
export function useAllTransactions() {
  const { shopID } = useAuth()

  const transactions = useLiveQuery(
    async () => {
      if (!shopID) return []
      return await transactionsTable
        .where('shopID')
        .equals(shopID)
        .toArray()
    },
    [shopID]
  )

  return transactions || []
}

/**
 * Hook: Get the current shop
 */
export function useShop() {
  const { shopID } = useAuth()

  const shop = useLiveQuery(
    async () => {
      if (!shopID) return null
      return await shopsTable.get(shopID)
    },
    [shopID]
  )

  return shop || null
}

/**
 * Hook: Watch online/offline status
 */
export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}
