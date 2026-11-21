# RentEquip — Equipment Rental Platform (Client)

A modern full-stack web application connecting heavy machinery and equipment owners with certified contractors and individual builders.

**Assignment 9 — Category 003: Equipment Rental Platform**

- **Live URL**: [https://equipment-rental-client-nine.vercel.app](https://equipment-rental-client-nine.vercel.app)
- **API URL**: [https://equipment-rental-server-delta.vercel.app](https://equipment-rental-server-delta.vercel.app)

---

## Key Features

1. **Dual-Compatibility Authentication & RBAC**:
   - BetterAuth and JWT/JWKS RS256 token verification.
   - Google OAuth 2.0 social sign-in.
   - Role-Based Access Control (`Customer`, `Owner`, `Admin`) with client-side `ProtectedRoute` guards.

2. **Complete Public Marketplace**:
   - Modern responsive UI with Light / Dark theme toggle.
   - Dynamic Hero Banner with Framer Motion animations.
   - 6 Featured equipment highlights fetched from database.
   - 6 Categorized equipment sectors.
   - Verified customer reviews and platform performance metrics.

3. **Advanced Catalog Search & Filters**:
   - Multi-field server search (equipment title, category, location) with regex escaping.
   - Category filtering pills and sidebar filters (Daily, Weekly, Monthly; Price range; Availability).
   - 3 sorting options (Price Low-to-High, Price High-to-Low, Recently Added).
   - Dynamic pagination with responsive empty and loading skeleton states.

4. **Equipment Details & Saved Favorites**:
   - Private route (`/equipment/:id`) protecting owner contact info from unauthenticated scraping.
   - Full technical specifications, condition, rental frequency, and available stock.
   - One-click "Add to Favorites" toggle with persistent user bookmarks.

5. **Stripe Test Mode Checkout & Verification**:
   - Interactive booking modal with live duration and price calculation.
   - Stripe Checkout hosted redirect.
   - Dedicated `/payment/success` page that verifies the transaction, decrements available stock, and records payment.

6. **Role-Tailored Dashboards**:
   - **Customer Portal**: Rental history table, saved favorites grid, and profile management with direct ImgBB file upload.
   - **Owner Portal**: Fleet analytics, dynamic monthly revenue (Challenge 3), machinery CRUD with ImgBB upload proxy, and client rental monitoring with completion controls.
   - **Admin Portal**: Platform-wide dynamic analytics, user management with role switching (`Customer`, `Owner`, `Admin`), equipment moderation (Approve / Reject / Delete), and all rental audit.

---

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Native Fetch with JWT bearer authorization

---

## Environment Variables Setup

Create a `.env.local` file in the `client` root directory:

```env
# Backend Server API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:5000

# Stripe Publishable Key (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

## Local Development

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Build & Production Verification

```bash
npm run build
npm run start
```
