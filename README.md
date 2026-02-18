# MyKernit

A multi-tenant debt management application for shop owners and businesses of all sizes. Built with React, Dexie.js, and Tailwind CSS with a fully offline, local-first architecture.

---

## ✨ Features

- **Multi-shop support** — Create and switch between multiple shops from a single device
- **Customer management** — Add, edit, and delete customers with name and phone number
- **Debt & payment tracking** — Log debts and payments with optional notes and timestamps
- **Reports** — Overview of shop activity and transaction history
- **Fully offline** — All data is stored locally in the browser (IndexedDB via Dexie.js). No internet required
- **Animated UI** — Smooth page transitions powered by Framer Motion
- **Desktop app** — Packaged as a Windows desktop app via Electron

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS (Emerald Green theme) |
| Routing | React Router v6 |
| Local Database | Dexie.js (IndexedDB) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Desktop | Electron |

---

## 🗂️ Project Structure

```
src/
├── contexts/         # Global auth/shop state (AuthContext)
├── db/               # Dexie database schema & operations
├── hooks/            # Custom React hooks (useCustomers, useCustomer, etc.)
├── pages/            # Page components
│   ├── SelectionScreen.jsx   # Shop selection on launch
│   ├── SetupScreen.jsx       # New shop creation
│   ├── Dashboard.jsx         # Customer list overview
│   ├── CustomerDetail.jsx    # Transactions for a customer
│   ├── AddCustomer.jsx       # Add a new customer
│   ├── EditCustomer.jsx      # Edit customer info
│   └── Reports.jsx           # Shop reports & stats
├── components/       # Reusable UI components
├── App.jsx           # Root component with routing
├── main.jsx          # Vite entry point
└── index.css         # Tailwind + global styles
```

---

## 📦 Data Model

**shops**
```
{
  id: string (unique shop ID)
  name: string
  createdAt: timestamp
}
```

**customers**
```
{
  id: string (UUID)
  shopID: string
  name: string
  phone: string
  currentBalance: number (positive = customer owes)
  createdAt: timestamp
}
```

**transactions**
```
{
  id: string (UUID)
  customerID: string
  shopID: string
  amount: number
  type: 'debt' | 'payment'
  note: string (optional)
  timestamp: timestamp
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- npm v9+

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Opens at `http://localhost:5173`

### Build for Web

```bash
npm run build
```

### Build Desktop App (Windows)

```bash
npm run electron-build
```

---

## 📖 Usage

### First Launch
- Choose an existing shop or create a new one on the **Selection Screen**
- Your shop ID is saved locally — no login or account needed

### Dashboard
- Lists all customers with their current balance
- Red balance = customer owes you money
- Green balance = customer has credit

### Customer Detail
- View full transaction history
- **Add debt** — record a credit sale
- **Record payment** — log a payment received

### Reports
- Overview of total debts, payments, and activity for your shop

---

## 🔌 Hooks Reference

### `useCustomers()`
Returns a live list of all customers for the current shop.

### `useCustomer(customerID)`
Returns a single customer and their transaction history.

### `useAllTransactions()`
Returns all transactions for the current shop (used in Reports).

### `useShop()`
Returns the current shop's data.

### `useOnlineStatus()`
Returns whether the device is online or offline.

---

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Edge 90+
- iOS Safari 15+

---

## 📄 License

Business use requires a commercial license. See [LICENSE](LICENSE) for details.

Built for shop owners who need a simple, reliable tool to manage customer credit — even without internet.
