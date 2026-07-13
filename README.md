# 👟 Premium Nike E-Commerce Hub

A premium, high-performance interactive Nike Store e-commerce application. Built with React (TypeScript), Vite, GSAP, and Framer Motion, it integrates secure Firebase Authentication and real-time Supabase database synchronizations.

---

## 🌟 Key Features

### 🎨 Immersive User Interface
- **Interactive 3D Cards:** Interactive credit cards (Visa Signature & Infinite) displaying real-time mouse-follow tilt mechanics and cursor-reflective light glares.
- **Micro-Animations:** Fluid, premium micro-interactions, spring animations, and state transitions using Framer Motion.
- **Autoplay Hero 3D Carousel:** A 3D-tilt shoe showcase viewport in the Hero section driven by GSAP timeline animations for scale down, swap, and spring-up rotations.
- **Hidden Scrollbars:** System-wide scrollbars are hidden while preserving native smooth-scroll capabilities.

### 🛍️ E-Commerce Engine
- **Global Stateful Product Catalog:** Manage products inside a persistent Zustand store synchronized with local storage.
- **Advanced Cart Flow:** Local guest cart items merge seamlessly with user-saved databases on login.
- **Interactive Order Tracking:** Real-time visual package tracking (Placed $\rightarrow$ Packed $\rightarrow$ Shipped).

### 🛡️ Administrative Console
- **Sales Analytics:** Live overview of Gross Revenue, Total Expenses, and Net Yield Margins with interactive fulfillment segmented bars.
- **Product Catalog Manager:** Complete CRUD capabilities (Add, Edit, and Delete products) with custom templates.
- **Transaction Ledger:** Live database modifications (updating customer emails, amounts, fulfillment states) or direct row removals synchronized with Supabase.
- **Administrative Logs:** Autocompiled security session logs monitoring login, signup, and signout events.

---

## 🛠️ Technology Stack

- **Framework:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Animations:** [GSAP (GreenSock)](https://greensock.com/gsap/) + [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [React Icons (Fa, Lu)](https://react-icons.github.io/react-icons/)
- **Database & Realtime:** [Supabase](https://supabase.com/)
- **Authentication:** [Firebase Auth](https://firebase.google.com/products/auth)

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/nike-ecommerce-store.git
cd nike-ecommerce-store

# Install dependencies
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server
```bash
npm run dev
```

---

## 🗄️ Database Schema Setup (Supabase)

To enable checkout tracking, order trackers, and administrative controls, execute the following SQL schema inside your Supabase SQL Editor:

```sql
-- 1. Profiles Table
CREATE TABLE public.profiles (
    id TEXT PRIMARY KEY,              -- Firebase UID
    email TEXT NOT NULL,
    username TEXT,
    full_name TEXT,
    phone TEXT,
    address TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Transactions Table
CREATE TABLE public.transactions (
    id TEXT PRIMARY KEY,              -- Custom TX-XXXX ID format
    uid TEXT NOT NULL,                -- Firebase UID
    email TEXT NOT NULL,
    date TEXT NOT NULL,               -- YYYY-MM-DD
    product TEXT NOT NULL,            -- "Model xQuantity"
    amount NUMERIC(10, 2) NOT NULL,   -- Total purchase price
    cogs NUMERIC(10, 2) NOT NULL,     -- Cost of goods sold
    freight NUMERIC(10, 2) NOT NULL,  -- Shipping fee
    status TEXT NOT NULL,             -- "Processing" or "Completed"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Activity Logs Table
CREATE TABLE public.activity_logs (
    id TEXT PRIMARY KEY,              -- Custom ACT-XXXX ID format
    email TEXT NOT NULL,
    uid TEXT,                         -- Firebase UID
    type TEXT NOT NULL,               -- e.g. "Sign Up", "Sign In", "Sign Out"
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime Channels for Live Dashboard Updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions;
```

---

## 📦 Production Deployment

Build the optimized static assets:
```bash
npm run build
```
The compiled output is outputted to the `dist/` directory, optimized and ready for hosting on Vercel, Netlify, or GitHub Pages.
