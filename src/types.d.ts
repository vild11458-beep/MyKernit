/// <reference types="dexie" />

/**
 * TypeScript Type Definitions for My Kernit
 * Optional but recommended for type safety
 */

export interface Shop {
  id: string
  name: string
  ownerPhone: string
  createdAt: number
  serverUpdatedAt: number
}

export interface Customer {
  id: string
  shopID: string
  name: string
  phone: string
  currentBalance: number
  isSynced: boolean
  serverUpdatedAt: number
  createdAt: number
}

export interface Transaction {
  id: string
  customerID: string
  shopID: string
  amount: number
  type: 'debt' | 'payment'
  note?: string
  timestamp: number
  isSynced: boolean
  serverUpdatedAt: number
}

export interface AuthContextType {
  currentUser: any
  shopID: string | null
  loading: boolean
  error: string | null
  logout: () => Promise<void>
  isAuthenticated: boolean
}

export interface SyncStatus {
  isSynced: boolean
  pendingCount: number
  isOnline: boolean
}

export interface UnsyncedRecords {
  unsyncedCustomers: Customer[]
  unsyncedTransactions: Transaction[]
}
