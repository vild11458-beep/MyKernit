import React, { createContext, useState, useEffect, useCallback } from 'react'
import { shopsTable, deleteShop as deleteShopFromDB } from '../db/db.js'

export const AuthContext = createContext()

/**
 * Simplified AuthProvider for local-only app
 * Uses localStorage to generate and persist a unique shopID
 * Checks if shop exists in database to determine if setup is needed
 */
export function AuthProvider({ children }) {
  const [shopID, setShopID] = useState(localStorage.getItem('myKernit_shopID'))
  const [shopExists, setShopExists] = useState(false)
  const [loading, setLoading] = useState(true)
  const [allShops, setAllShops] = useState([])

  const refreshShopsList = useCallback(async () => {
    try {
      const shops = await shopsTable.toArray()
      setAllShops(shops)
      return shops
    } catch (error) {
      console.error('✗ Error loading shops list:', error)
      return []
    }
  }, [])

  const checkShopStatus = useCallback(async (id = shopID) => {
    if (!id) {
      setShopExists(false)
      return false
    }
    try {
      const shop = await shopsTable.get(id)
      if (shop) {
        setShopID(id)
        localStorage.setItem('myKernit_shopID', id)
        setShopExists(true)
        return true
      }
    } catch (error) {
      console.error('✗ Error checking shop status:', error)
    }
    setShopExists(false)
    return false
  }, [shopID])

  useEffect(() => {
    async function init() {
      await refreshShopsList()
      const currentID = localStorage.getItem('myKernit_shopID')
      if (currentID) {
        await checkShopStatus(currentID)
      }
      setLoading(false)
    }
    init()
  }, [refreshShopsList, checkShopStatus])

  const selectShop = useCallback(async (id) => {
  const success = await checkShopStatus(id)
  return success
  }, [checkShopStatus])

  const logout = useCallback(() => {
    localStorage.removeItem('myKernit_shopID')
    setShopID(null)
    setShopExists(false)
  }, [])

  const deleteShop = useCallback(async (shopIDToDelete) => {
    try {
      await deleteShopFromDB(shopIDToDelete)
      // If we're deleting the currently selected shop, clear it
      if (shopID === shopIDToDelete) {
        logout()
      }
      // Refresh the shops list
      await refreshShopsList()
      return true
    } catch (error) {
      console.error('✗ Error deleting shop:', error)
      return false
    }
  }, [shopID, logout, refreshShopsList])

  // For backward compatibility and development
  const createNewShopID = useCallback(() => {
    return `shop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }, [])

  const value = {
    shopID,
    shopExists,
    loading,
    allShops,
    isAuthenticated: true,
    selectShop,
    logout,
    deleteShop,
    checkShopStatus,
    refreshShopsList,
    createNewShopID,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
