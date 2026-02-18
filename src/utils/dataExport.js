import { customersTable, transactionsTable, shopsTable } from '../db/db.js'

/**
 * Export all data as JSON
 * @param {string} shopID - Shop ID to export data for
 * @returns {Promise<void>}
 */
export async function exportData(shopID) {
    try {
        // Get all data for this shop
        const customers = await customersTable
            .where('shopID')
            .equals(shopID)
            .toArray()

        const transactions = await transactionsTable
            .where('shopID')
            .equals(shopID)
            .toArray()

        const shop = await shopsTable.get(shopID)

        // Create export object
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            shopID,
            shop,
            customers,
            transactions,
        }

        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: 'application/json' })
        const url = URL.createObjectURL(dataBlob)

        const link = document.createElement('a')
        link.href = url
        link.download = `mykernit-backup-${new Date().toISOString().split('T')[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        console.log('✓ Data exported successfully')
        return true
    } catch (error) {
        console.error('✗ Export failed:', error)
        throw error
    }
}

/**
 * Import data from JSON file
 * @param {File} file - JSON file to import
 * @param {string} shopID - Current shop ID
 * @returns {Promise<void>}
 */
export async function importData(file, shopID) {
    try {
        const text = await file.text()
        const data = JSON.parse(text)

        // Validate data structure
        if (!data.version || !data.customers || !data.transactions) {
            throw new Error('Invalid backup file format')
        }

        // Import customers
        for (const customer of data.customers) {
            // Update shopID to current shop
            customer.shopID = shopID

            // Check if customer already exists
            const existing = await customersTable.get(customer.id)
            if (existing) {
                await customersTable.update(customer.id, customer)
            } else {
                await customersTable.add(customer)
            }
        }

        // Import transactions
        for (const transaction of data.transactions) {
            // Update shopID to current shop
            transaction.shopID = shopID

            // Check if transaction already exists
            const existing = await transactionsTable.get(transaction.id)
            if (!existing) {
                await transactionsTable.add(transaction)
            }
        }

        console.log(`✓ Imported ${data.customers.length} customers and ${data.transactions.length} transactions`)
        return {
            customersCount: data.customers.length,
            transactionsCount: data.transactions.length,
        }
    } catch (error) {
        console.error('✗ Import failed:', error)
        throw error
    }
}

/**
 * Export customers as CSV
 * @param {string} shopID - Shop ID to export data for
 * @returns {Promise<void>}
 */
export async function exportCustomersCSV(shopID) {
    try {
        const customers = await customersTable
            .where('shopID')
            .equals(shopID)
            .toArray()

        // Create CSV content
        const headers = ['Name', 'Phone', 'Current Balance', 'Created At']
        const rows = customers.map(c => [
            c.name,
            c.phone,
            c.currentBalance,
            new Date(c.createdAt).toLocaleDateString(),
        ])

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n')

        // Download CSV
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = `customers-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        console.log('✓ Customers exported as CSV')
        return true
    } catch (error) {
        console.error('✗ CSV export failed:', error)
        throw error
    }
}
