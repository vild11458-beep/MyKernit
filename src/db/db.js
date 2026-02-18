import Dexie from 'dexie'

/**
 * My Kernit Database Schema (Local-Only)
 * Three main tables: shops, customers, transactions
 * All data stored locally in IndexedDB
 */
export const db = new Dexie('MyKernit')

// Version 1: Simple local-only schema
db.version(1).stores({
  shops: '&id',
  customers: '&id, shopID, name, phone',
  transactions: '&id, customerID, shopID, timestamp',
})

/**
 * Shop Schema
 */
export const shopsTable = db.table('shops')

/**
 * Customer Schema with indexes for efficient queries
 * - shopID: for filtering by shop
 * - name: for searching customers
 * - phone: for searching by phone number
 */
export const customersTable = db.table('customers')

/**
 * Transactions Schema
 * - customerID: to fetch transactions for a customer
 * - shopID: for shop filtering
 * - timestamp: to sort by date
 */
export const transactionsTable = db.table('transactions')

/**
 * Initialize database
 */
export async function initializeDatabase() {
  try {
    await db.open()
    const shopCount = await shopsTable.count()
    console.log(`✓ Database initialized ${shopCount > 0 ? `with ${shopCount} shops` : '(empty state)'}`)
  } catch (error) {
    console.error('✗ Database initialization error:', error)
    throw error
  }
}

/**
 * Add a new customer
 * @param {string} shopID - Shop ID
 * @param {Object} customerData - { name, phone }
 * @returns {Promise<string>} - New customer ID
 */
export async function addCustomer(shopID, customerData) {
  const id = crypto.randomUUID()
  const now = Date.now()

  await customersTable.add({
    id,
    shopID,
    name: customerData.name,
    phone: customerData.phone,
    currentBalance: 0,
    createdAt: now,
  })

  return id
}

/**
 * Add a new transaction (debt or payment)
 * @param {string} customerID
 * @param {string} shopID
 * @param {number} amount
 * @param {string} type - 'debt' or 'payment'
 * @param {string} note - Transaction note
 * @returns {Promise<string>} - New transaction ID
 */
export async function addTransaction(customerID, shopID, amount, type, note = '') {
  const id = crypto.randomUUID()
  const now = Date.now()

  await transactionsTable.add({
    id,
    customerID,
    shopID,
    amount,
    type, // 'debt' or 'payment'
    note,
    timestamp: now,
  })

  // Update customer's currentBalance
  const customer = await customersTable.get(customerID)
  if (customer) {
    const newBalance = type === 'debt'
      ? customer.currentBalance + amount
      : customer.currentBalance - amount

    await customersTable.update(customerID, {
      currentBalance: newBalance,
    })
  }

  return id
}

/**
 * Get all customers for a shop
 * @param {string} shopID
 * @returns {Promise<Array>}
 */
export async function getCustomersByShop(shopID) {
  return await customersTable
    .where('shopID')
    .equals(shopID)
    .toArray()
}

/**
 * Get a single customer by ID
 * @param {string} customerID
 * @returns {Promise<Object>}
 */
export async function getCustomer(customerID) {
  return await customersTable.get(customerID)
}

/**
 * Get all transactions for a customer
 * @param {string} customerID
 * @returns {Promise<Array>}
 */
export async function getTransactionsByCustomer(customerID) {
  return await transactionsTable
    .reverse()
    .sortBy('timestamp')
}

/**
 * Delete a customer and their transactions
 * @param {string} customerID 
 */
export async function deleteCustomer(customerID) {
  await db.transaction('rw', [customersTable, transactionsTable], async () => {
    // Delete all transactions first
    await transactionsTable.where('customerID').equals(customerID).delete()
    // Delete the customer
    await customersTable.delete(customerID)
  })
}

/**
 * Get all transactions for a shop
 * @param {string} shopID
 * @returns {Promise<Array>}
 */
export async function getTransactionsByShop(shopID) {
  return await transactionsTable
    .where('shopID')
    .equals(shopID)
    .reverse()
    .sortBy('timestamp')
}

/**
 * Update a customer's basic info
 * @param {string} customerID
 * @param {Object} data - { name, phone }
 */
export async function updateCustomer(customerID, data) {
  await customersTable.update(customerID, data)
}
/**
 * Update a shop's basic info
 * @param {string} shopID
 * @param {Object} data - { name, city, ownerName, ... }
 */
export async function updateShop(shopID, data) {
  await shopsTable.update(shopID, data)
}

/**
 * Delete a shop and all its related data (customers and transactions)
 * @param {string} shopID
 */
export async function deleteShop(shopID) {
  await db.transaction('rw', [shopsTable, customersTable, transactionsTable], async () => {
    // Delete all transactions for this shop
    await transactionsTable.where('shopID').equals(shopID).delete()
    // Delete all customers for this shop
    await customersTable.where('shopID').equals(shopID).delete()
    // Delete the shop itself
    await shopsTable.delete(shopID)
  })
}
