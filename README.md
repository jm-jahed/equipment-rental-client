# RentEquip — Commercial Equipment Rental Platform (Client)

A comprehensive commercial equipment rental marketplace web application built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**. RentEquip bridges the gap between equipment owners with underutilized commercial machinery and certified contractors or individual builders seeking affordable, flexible rental terms.

> **Academic Context:**  
> Developed for **Assignment 9 — Category 003: Equipment Rental Platform**.  
> Evaluated under strict assignment criteria including complete role-based access control, dynamic server-side catalog filtering, Stripe Test Mode payment processing, and comprehensive multi-role dashboards.

---

## 1. Project URLs

- **Live Client Application:** [https://equipment-rental-client-nine.vercel.app](https://equipment-rental-client-nine.vercel.app)
- **Live Backend API:** [https://equipment-rental-server-delta.vercel.app](https://equipment-rental-server-delta.vercel.app)
- **Client Local Development:** `http://localhost:3000`
- **Server Local Development:** `http://localhost:5000`

---

## 2. Project Purpose & Core Value

Commercial machinery and specialized gear (heavy excavators, high-output generators, cinema camera kits, agricultural harvesters) require substantial capital expenditure. RentEquip establishes a transparent, reliable, and secure rental marketplace enabling:
1. **Equipment Owners:** Monetize idle machinery fleets, manage listing availability, monitor active rentals, and track monthly earnings.
2. **Customers / Contractors:** Search and filter verified machinery by category, location, and price in Bangladeshi Taka (৳ BDT), book rental dates, and checkout securely via Stripe Test Mode.
3. **Platform Administrators:** Moderate incoming equipment submissions (Approve / Reject), oversee user roles (`Customer`, `Owner`, `Admin`), audit platform-wide bookings, and review aggregate GMV performance.

---

## 3. Comprehensive Feature Overview

### Public Marketplace & Navigation
- **Responsive Header Navigation:** Sticky navigation bar with RentEquip branding, public links (*Home*, *All Equipment*, *How It Works*, *About Us*, *Contact Us*), active route indicators, theme toggle, and dynamic user session controls.
- **Interactive Dark / Light Mode:** LocalStorage-backed theme toggle persisting user preference across page reloads.
- **Dynamic Hero Banner:** Engaging hero banner with high-contrast typography, clear CTA buttons (*"Browse All Equipment"*, *"List Your Equipment"*), and Framer Motion stagger animations.
- **Featured Equipment Showcase:** Displays exactly 6 approved machinery listings directly fetched from the backend using MongoDB `.limit(6)`.
  - Unauthenticated visitors clicking *"View Details"* are redirected to `/login?redirect=...`.
  - Authenticated users are routed directly to the item's technical specifications page.
- **Customer Reviews & Testimonials:** Localized demonstration reviews tailored for the Bangladesh commercial sector, complete with authentic profiles, professional backgrounds, and a transparent `Sample Customer Reviews` demonstration badge.
- **Extra Marketplace Sections:** Dedicated *"Why Choose Us"* value propositions, *"How It Works"* 3-step rental guide, and platform reliability metrics.
- **Comprehensive Footer:** Quick directory links to all 6 official equipment categories, platform contacts in Dhaka, legal terms, privacy policies, and branding.

### The 6 Official Assignment Categories
RentEquip organizes its entire catalog into the six required categories:

1. **Construction Equipment:** Heavy hydraulic excavators, compact mini excavators, skid-steer loaders, tandem vibratory rollers.
2. **Photography Equipment:** Full-frame 4K cinema camera kits, multi-format 8K packages, professional 3-axis camera gimbals, daylight high-output LED fixtures.
3. **Vehicles & Transportation:** Diesel industrial forklifts, heavy rough-terrain forklifts, telescopic handlers (14m reach), electric pallet stackers.
4. **Agriculture Equipment:** Multi-speed farm tractors, paddy combine harvesters, utility tractors, walking power tillers.
5. **Electronics:** Soundproof diesel generator sets, industrial canopy generators, whisper-quiet generators, silent inverter generators.
6. **Event Equipment:** Large-format concert line array sound systems, aluminum stage truss roof rigs, digital concert mixing consoles, hybrid moving head lighting packages.

### Catalog Search, Filtering & Pagination
- **Multi-Field Server Search:** Real-time text search querying equipment name, category, location, and description simultaneously with regex escaping.
- **Category Filter Tabs:** One-click quick-filtering across all 6 equipment categories plus an *"All"* overview.
- **Sidebar Attribute Filters:**
  - **Rental Frequency:** Radio toggle between *All*, *Daily*, *Weekly*, and *Monthly*.
  - **Price Range (৳ BDT):** Numeric inputs for minimum and maximum rental rate boundaries.
  - **Availability Toggle:** Checkbox filtering strictly for in-stock equipment (`availableQuantity > 0`).
- **Server-Side Sorting:**
  - *Price: Low to High* (`price_asc`)
  - *Price: High to Low* (`price_desc`)
  - *Recently Added* (`recent`, default)
- **Dynamic Pagination:** Clean pagination controls (*Previous*, numeric pages, *Next*) showing active item counts and total pages.

### Equipment Details & Favorites
- **Protected Route Guard (`/equipment/[id]`):** Restricts full technical specifications and verified owner contact information to authenticated users, protecting owner phone and email from unauthorized harvesting.
- **Unauthenticated Redirect with Destination Memory:** Unauthenticated visitors accessing a detail link are redirected to `/login?redirect=%2Fequipment%2F:id` and automatically returned to the machinery page immediately upon successful sign-in.
- **Machinery Specifications:** Detailed view displaying high-resolution imagery with fallback protection, equipment condition (*New*, *Good*, *Fair*), rental frequency, remaining stock, location, and terms.
- **Add to Favorites:** One-click bookmarking button with optimistic UI updates, persisting in the database and rendering in the Customer Dashboard.

### Stripe Test Mode Demo Payment Workflow
- **Interactive Booking Modal:** Validates rental start date and end date (enforcing minimum 1-day duration and chronological order), quantity selection up to available stock, contact phone number, delivery address, and optional project notes.
- **Server-Side Amount Calculation:** The backend strictly calculates `durationDays * rentalPrice * quantity` in BDT (৳) and constructs the Stripe Checkout session in minor units (paisa). The client price is never trusted.
- **Stripe Hosted Checkout:** Seamless redirect to Stripe's secure test-mode checkout page displaying the exact BDT amount.
- **Test Mode Exclusivity:** Operates 100% in Stripe Test Mode using sandbox credentials. **No real-money transactions are ever executed.** Evaluators can use standard Stripe test cards (e.g. `4242 4242 4242 4242`).
- **Automated Webhook & Verification:** Upon payment authorization, Stripe's signed webhook confirms the booking, inserts the transaction in the `payments` collection, marks the booking as `Paid` / `Confirmed`, and decrements available inventory.
- **Payment Success Screen (`/payment/success`):** Displays transaction reference (`pi_...`), confirmation breakdown, and navigation links back to the Customer Dashboard.

---

## 4. Role-Based Dashboards

### Customer Dashboard (`/dashboard`)
- **My Rentals:** Tabular overview of all equipment rented by the logged-in user, showing Equipment Name, Start Date, End Date, Booking Date, Total Cost (৳ BDT), Payment Status (`Paid`, `Pending`, `Refunded`), and Booking Status (`Confirmed`, `Completed`, `Cancelled`).
- **Saved Favorites (`/dashboard/customer/favorites`):** Grid of bookmarked machinery with direct detail navigation links and one-click removal.
- **Customer Profile (`/dashboard/profile`):** View and update personal information (Full Name, Phone Number, Delivery Address, Profile Avatar via ImgBB upload proxy).

### Owner Dashboard (`/dashboard/owner`)
- **Fleet Analytics:** Real-time counters showing total listed machinery, active rentals, completed bookings, and cumulative revenue in BDT.
- **Monthly Revenue Breakdown:** Challenge 3 dynamic revenue tracking displaying earnings across recent calendar months.
- **Add Equipment (`/dashboard/owner/add-equipment`):** Comprehensive registration form for listing new machinery:
  - Equipment Name, Description, Category (all 6 official categories dropdown)
  - Location, Daily Rental Rate (৳ BDT), Rental Frequency (*Daily*, *Weekly*, *Monthly*)
  - Available Quantity, Equipment Condition (*New*, *Good*, *Fair*), Brand, Model
  - Equipment Image (direct file upload to ImgBB via secure server proxy)
  - Rental Terms & Conditions
  - Default status automatically set to `Pending` awaiting administrative approval.
- **My Equipment (`/dashboard/owner/my-equipment`):** Table of owner listings with status badges (`Pending`, `Approved`, `Rejected`), available stock counts, modal edit controls, and delete confirmation.
- **My Equipment Rentals (`/dashboard/owner/rentals`):** Table displaying bookings made by customers on the owner's fleet, showing customer details, duration, quantity, total amount, payment status, and completion toggles.

### Admin Dashboard (`/dashboard/admin`)
- **Platform Analytics:** Executive overview displaying total registered users, total fleet machinery, total platform bookings, cumulative revenue in BDT, pending approval queues, and monthly booking statistics.
- **All Users Management (`/dashboard/admin/users`):** Paginated table of all registered accounts displaying Name, Email, Role badge, and Registration Date, with inline dropdowns to switch user roles (`Customer`, `Owner`, `Admin`) and delete accounts.
- **Equipment Moderation (`/dashboard/admin/equipment`):** Comprehensive moderation interface displaying all submitted machinery with one-click **Approve** and **Reject** controls, modal editor, and deletion capabilities.
- **All Rentals Oversight (`/dashboard/admin/rentals`):** Global audit table tracking every rental transaction across the platform with customer and owner information, rental duration, payment status, and booking status.

---

## 5. Technology Stack & Packages

### Client Architecture
| Category | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 14.2.35 | React framework with App Router, server/client components, dynamic routing |
| **Language** | TypeScript 5 | End-to-end static typing, interface contracts, and build-time safety |
| **Styling** | Tailwind CSS 3.4.1 | Utility-first CSS styling with customized dark mode color palettes |
| **UI Components** | Custom Tailwind + Lucide React | Modular buttons, inputs, modals, badges, and alerts |
| **Icons** | Lucide React 1.77.0 | High-contrast, scalable iconography across all interfaces |
| **Animations** | Framer Motion 14.14.0 | Staggered entrances, hero banner animations, and smooth transitions |
| **Authentication Client** | BetterAuth Client 1.7.27 | Social OAuth bridges and token session synchronization |
| **Notifications** | React Hot Toast 2.6.1 | Clean, non-blocking toast notifications for user actions |
| **Utility Libraries** | `clsx`, `tailwind-merge` | Conditional class name joining and conflict resolution |

---

## 6. Environment Variables Setup

Create a `.env.local` file in the `client` directory:

```env
# Backend API Root URL (No trailing slash)
# For local development:
NEXT_PUBLIC_API_URL=http://localhost:5000

# For production deployment:
# NEXT_PUBLIC_API_URL=https://equipment-rental-server-delta.vercel.app

# BetterAuth Base Origin (Matches backend origin)
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:5000
```

> **Note:** The client application does **not** store Stripe secret keys, database credentials, or private signing keys. All sensitive operations are handled strictly on the backend.

---

## 7. Local Installation & Development

### Prerequisites
- Node.js version 18.x or 20.x or 22.x
- npm version 9.x or higher

### Step-by-Step Instructions

1. **Navigate to the Client workspace:**
   ```bash
   cd client
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create `.env.local` based on the template above.

4. **Start the local development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 8. Production Build & Verification

To verify that the client builds cleanly with zero TypeScript or ESLint errors:

```bash
# Compile and build the production bundle
npm run build

# Start the compiled production build locally
npm run start
```

All 27 dynamic and static routes compile cleanly with zero errors.

---

## 9. Evaluator & Demo Account Guidelines

For academic grading and platform evaluation:

1. **Self-Registration (Customer Role):**  
   Evaluators may register a new account on `/register`. By default, newly registered accounts receive the `Customer` role.
   - *Password Requirements:* At least 1 uppercase letter, at least 1 lowercase letter, and at least 6 characters total.
2. **Google OAuth 2.0:**  
   Clicking *"Continue with Google"* on the Login or Register page authenticates via Google OAuth and assigns the default `Customer` role.
3. **Role Elevation & Administration:**  
   Once logged in as an Administrator, you can navigate to `/dashboard/admin/users` and modify any user's role to `Owner` or `Admin` via the role selector dropdown.
4. **Pre-Configured Accounts:**  
   Administrator and Owner evaluation accounts are pre-configured on the live deployment. Login credentials for these accounts are provided directly in the academic submission portal to prevent public exposure.

---

## 10. Security & Compliance Notes

1. **Stripe Test Mode Only:** Real credit cards must never be used. All payment workflows operate within the Stripe sandbox using test cards.
2. **Private Route Protection:** Unauthenticated access to `/equipment/:id` and all `/dashboard/*` sub-routes is intercepted by `<ProtectedRoute>`, preventing access and safeguarding user data.
3. **Zero Hardcoded Credentials:** No API keys, database URIs, or secrets exist within client-side code bundles.
4. **Sample Testimonial Transparency:** Customer testimonials on the homepage are demonstration examples tailored for the Bangladesh marketplace and are clearly badged as *Sample Customer Reviews*.
