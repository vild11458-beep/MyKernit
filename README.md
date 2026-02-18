# My Kernit

A multi-tenant debt management PWA for shop owners in Algeria. Built with React, Firebase, Dexie, and Tailwind CSS with offline-first architecture.

## 🏗️ Project Architecture

### Phase 1: Infrastructure (✅ COMPLETE)

#### Core Tech Stack
- **Frontend**: React 18 + Vite (build) + React Router (routing)
- **Styles**: Tailwind CSS with Emerald Green (#064E3B) primary color
- **Icons**: Lucide-React
- **Auth**: Firebase Phone Authentication (SMS OTP)
- **Database**: Firebase Firestore + Dexie.js
- **Offline-First**: Optimistic writes to Dexie, background sync to Firestore

#### Project Structure
```
src/
├── contexts/          # Global state (Auth)
│   └── AuthContext.jsx
├── db/               # Dexie database schema & operations
│   └── db.js
├── hooks/            # Custom React hooks (useCustomers, useSyncStatus, etc.)
│   └── index.js
├── pages/            # Page components (routed)
│   ├── LoginScreen.jsx
│   ├── Dashboard.jsx
│   ├── CustomerDetail.jsx
│   └── AddCustomer.jsx
├── services/         # Business logic (sync, auth flows)
│   └── syncService.js
├── utils/            # Utilities (Firebase config)
│   └── firebase.js
├── App.jsx           # Root component with React Router
├── main.jsx          # Vite entry point
└── index.css         # Tailwind + global styles
```

### Data Model

**shops** collection:
```
{
  id: string (shopID)
  name: string
  ownerPhone: string (with +country code)
  createdAt: timestamp
  serverUpdatedAt: timestamp (for sync)
}
```

**customers** collection:
```
{
  id: string (UUID)
  shopID: string (references parent shop)
  name: string
  phone: string
  currentBalance: number (in DZD, positive = customer owes)
  isSynced: boolean (Dexie marker)
  serverUpdatedAt: timestamp (for conflict resolution)
  createdAt: timestamp
}
```

**transactions** collection:
```
{
  id: string (UUID)
  customerID: string (foreign key)
  shopID: string (multi-tenant security)
  amount: number (in DZD)
  type: 'debt' | 'payment'
  note: string (optional)
  timestamp: timestamp
  isSynced: boolean (Dexie marker)
  serverUpdatedAt: timestamp (for conflict resolution)
}
```

### Offline-First Sync Architecture

1. **Write Flow** (optimistic):
   - User adds debt/payment → Write to Dexie immediately
   - UI updates instantly with local data
   - Background: Sync queued record to Firestore
   - Firestore success → Mark `isSynced: true` in Dexie

2. **Read Flow** (live):
   - `useLiveQuery()` hook subscribes to Dexie changes
   - Dexie drives UI with real-time reactive updates
   - Background: Pull remote data from Firestore into Dexie (every 10s)

3. **Conflict Resolution**:
   - Compare `serverUpdatedAt` timestamps
   - Server wins if newer; local data keeps precedence if newer
   - Since shop owner is sole editor, conflicts are rare (only multi-device scenarios)

4. **Sync Status Pill**:
   - "SYNCHRONISÉ" - All records synced, online
   - "HORS LIGNE" - No internet connection
   - "SYNC... (3)" - 3 records pending sync

### Multi-Tenant Security

**Every** database query enforces shopID filtering:

```javascript
// ✅ Correct: Dexie query filtered by shopID
const customers = await customersTable
  .where('shopID')
  .equals(shopID)
  .toArray()

// ✅ Correct: Firestore query filtered by shopID
const query = query(
  collection(db, 'shops', shopID, 'customers'),
  where('shopID', '==', shopID)
)
```

**Firestore Security Rules** (to implement):
```
match /shops/{shopID}/customers/{customerID} {
  allow read, write: if request.auth.uid == shopID
}
match /shops/{shopID}/transactions/{transactionID} {
  allow read, write: if request.auth.uid == shopID
}
```

---

## 🚀 Setup & Installation

### Prerequisites
- **Node.js** v18+ (download from [nodejs.org](https://nodejs.org))
- **npm** v9+ (comes with Node.js)
- **Firebase Project** (create at [firebase.google.com](https://firebase.google.com))
- **Git** (for version control)

### Step 1: Install Node.js
1. Go to [nodejs.org](https://nodejs.org)
2. Download LTS version (v20+)
3. Run installer, accept defaults
4. Verify installation:
   ```bash
   node --version   # Should print v20.x.x or higher
   npm --version    # Should print 10.x.x or higher
   ```

### Step 2: Install Dependencies

```bash
cd c:\Users\Utilisateur\StudioProjects\MyKernit
npm install
```

This installs:
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `firebase` - Backend + auth
- `dexie` - Local database
- `lucide-react` - Icons
- `@tanstack/react-query` - Data fetching (optional, for later)
- `tailwindcss` & `postcss` - Styling
- `vite` & dev tools - Build & development

### Step 3: Configure Firebase

1. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com)
   - Click "Add Project"
   - Name it "My Kernit", enable Firestore + Authentication
   
2. Set up Phone Authentication:
   - Go to Firebase Console → Authentication → Sign-in Method
   - Enable "Phone"
   - Add test phone numbers for development (e.g., +213612345678)

3. Get your Firebase config:
   - Firebase Console → Project Settings → Your Apps → Web
   - Copy the config object

4. Create `.env.local` file in project root:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Step 4: Run Development Server

```bash
npm run dev
```

Opens automatically at `http://localhost:5173`

- Hot Module Reload (HMR): Code changes refresh instantly
- Ctrl+C to stop server

### Step 5: Build for Production

```bash
npm run build
```

Generates optimized bundle in `/dist` folder

---

## 📖 Usage

### Login Flow
1. Enter phone number with country code: `+213612345678` (Algeria)
2. Firebase sends SMS with 6-digit OTP
3. Enter OTP to verify
4. Redirects to dashboard

### Dashboard
- Lists all customers with current balance
- Red balance = customer owes you
- Green balance = customer has credit (rare)
- Click customer card to view details

### Customer Detail
- View transaction history
- "Ajouter dette" (red) - Record debt/sale
- "Enregistrer paiement" (green) - Record payment
- Each entry includes date + optional note

### Add Customer
- Enter name + phone
- Auto-saves to Dexie locally
- Background sync to Firestore when online

### Offline Support
- All reads/writes work offline
- Sync pill shows status
- On reconnect, auto-syncs pending records

---

## 🔌 API Hooks Reference

### `useAuth()`
```javascript
const { currentUser, shopID, logout, isAuthenticated } = useAuth()
```

### `useCustomers()`
```javascript
const customers = useCustomers() // Real-time live query
```

### `useCustomer(customerID)`
```javascript
const { customer, transactions } = useCustomer(customerID)
```

### `useSyncStatus()`
```javascript
const { isSynced, pendingCount, isOnline } = useSyncStatus()
```

### `useOnlineStatus()`
```javascript
const isOnline = useOnlineStatus()
```

---

## 🔐 Security Checklist

- [ ] Firebase Security Rules enforced (shopID checking)
- [ ] Phone Auth configured with reCAPTCHA
- [ ] Environment variables (`VITE_*`) are in `.env.local` (NOT committed)
- [ ] Firestore rules: deny access across shops
- [ ] Rate limiting on sync operations (5s between syncs)

---

## 📱 Browser Support

- iOS Safari 15+
- Chrome 90+
- Firefox 88+
- Edge 90+
- Supports PWA (Install to Home Screen on iOS/Android)

---

## 🐛 Troubleshooting

### App won't start
```bash
npm install              # Reinstall dependencies
rm -rf node_modules     # Clear cache
npm run dev
```

### Firebase errors
- Check `.env.local` has correct credentials
- Verify Phone Auth is enabled in Firebase Console
- Test with phone number in Firestore Console

### Offline not working
- Dexie requires IndexedDB (all modern browsers)
- Check DevTools → Storage → IndexedDB → MyKernit

### reCAPTCHA issues
- Firebase Phone Auth uses invisible reCAPTCHA
- Must run on `localhost:5173` or deployed HTTPS domain
- Add domain to reCAPTCHA whitelist in Firebase Console

---

## 📚 Available Scripts

```bash
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Build for production (/dist)
npm run preview  # Preview production build locally
npm run lint     # Check code quality (ESLint)
```

---

## 🎨 Customization

### Colors
Edit [tailwind.config.js](tailwind.config.js):
```javascript
colors: {
  primary: {
    900: '#064e3b', // Change to your brand color
  }
}
```

### Language
Currently French. To add English/Arabic:
1. Create `/src/i18n/translations.js`
2. Replace hardcoded strings with i18n calls
3. Use a library like `i18next` for language switching

---

## 🚀 Next Steps (Phase 2 & 3)

### Phase 2: Component Conversion
- [ ] Convert HTML mockups from `/stitch` folder into React components
- [ ] Extract Tailwind classes and reuse
- [ ] Build reusable UI library (buttons, modals, inputs)

### Phase 3: Data Integration
- [ ] Replace hardcoded prices with real bond data
- [ ] Add search/filter to customer list
- [ ] Export transactions to CSV/PDF
- [ ] Dark mode toggle persistence
- [ ] Add shop settings screen

### Production Ready
- [ ] Deploy to Vercel/Firebase Hosting
- [ ] Enable PWA (manifest.json, service worker)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Analytics (Firebase Analytics)
- [ ] Error tracking (Sentry)

---

## 📄 License

Proprietary - My Kernit

---

## 💬 Support

For questions or issues, refer to the inline comments in `/src` files.

Built with ❤️ for Algerian shop owners.
