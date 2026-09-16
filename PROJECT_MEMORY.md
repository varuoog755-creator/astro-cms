# 🏰 TEEPUL LUXURY CURTAINS & HOME DECOR - PROJECT MEMORY & MASTER RULES

> **Corpus / Workspace Path:** `c:\Users\Gourav\Documents\Profile create tee\astro-ecom-cms`  
> **Live Web Application URL:** `https://teepul.com` (Render Web Service: `https://astro-cms.onrender.com`)  
> **Last Updated:** September 16, 2026

---

## 🎯 STRICT OPERATIONAL RULES FOR AI ASSISTANT (ANTIGRAVITY)

1. **SCOPE SCOPE SCOPE (ONLY CHANGE WHAT IS REQUESTED)**
   - When the user asks for a specific change, modify **ONLY** that feature or file.
   - **DO NOT** redesign, rewrite, or alter existing UI layouts, color palettes (amber/slate luxury theme), header/footer structures, or pages unless explicitly requested.

2. **STRICT TECH STACK & FRAMEWORK**
   - Built 100% with **Astro Framework (SSR Mode)** + **TypeScript** + **Tailwind CSS** + **Prisma ORM** + **SQLite Database (`prisma/cms.db`)**.
   - Do NOT introduce breaking frameworks or unnecessary npm packages.

3. **CHECK PREVIOUS WORK BEFORE EDITING**
   - Before executing any change, inspect existing code, schemas, routes, and links to ensure no working feature, API route, or database relationship is broken.

4. **100% STRICT SEPARATION OF CUSTOMER VS ADMIN AUTHENTICATION**
   - **Customer Portal (`https://teepul.com/login`)**: Strictly for customers (Google Sign-In + Email Sign In/Register). Authenticated customers land on `/account`. Public headers, footers, and customer views MUST NOT contain any links, buttons, or references to the Admin Panel.
   - **Secret Admin Portal (`https://teepul.com/admin/login`)**: Accessible strictly via secret URL `/admin/login` for the store owner/admin (`govinda755rock755@gmail.com`).

5. **PERMANENT DATA RETENTION & ZERO DATA-LOSS POLICY (CRITICAL)**
   - All 19 Curtain & Decor Products, Customer Orders, Order Items, Customer Profiles, and Integration Settings MUST persist 100% permanently in the SQLite database (`prisma/cms.db`).
   - NEVER execute `prisma migrate reset`, `prisma db push --force-reset`, `prisma db seed`, or any command that drops or truncates database tables.
   - Code edits or Render auto-deployments MUST NEVER reset, wipe, or overwrite the database.
   - Automatic database backups are taken via `python scripts/backup_db.py` before any database operation.

---

## 📌 MASTER SITEMAP & ACCESSIBLE URLS

### Public Storefront
- `https://teepul.com/` - Storefront Homepage (Panipat Manufacturing Unit, Bestsellers, New Arrivals)
- `https://teepul.com/products` - Storefront Catalog (Fast `🛒 +Add` buttons + Category Filters)
- `https://teepul.com/products/[slug]` - Single Product Detail Page
- `https://teepul.com/checkout` - Express Checkout Page (Razorpay, Paytm, COD, WhatsApp)
- `https://teepul.com/checkout/success` - Order Success & Summary Confirmation Page
- `https://teepul.com/about` - About Panipat Manufacturing Unit & Heritage
- `https://teepul.com/search` - Global Product & Blog Search

### Customer Account & Auth
- `https://teepul.com/login` - Customer Sign In & Registration (Google OAuth + Email/Password)
- `https://teepul.com/account` - Customer Dashboard (Editable Profile, Delivery Address, Order History, Live Package Tracking, Logout)
- `https://teepul.com/api/auth/logout` - Session Destroy & Cookie Clear Endpoint

### Secret Admin Portal (Admin Only)
- `https://teepul.com/admin/login` - Private Secret Admin Login (`govinda755rock755@gmail.com` / `Govinda@755`)
- `https://teepul.com/admin` - Live Admin Overview Dashboard
- `https://teepul.com/admin/orders` - Customer Orders, Curtain Specifications (Color, Size, Address, Phone, Product Link), Day-by-Day Date Filters, EKart Logistics Courier Booking
- `https://teepul.com/admin/products` - Curtains & Decor Catalog Management
- `https://teepul.com/admin/analytics` - Real-Time Sales & Logistics Analytics
- `https://teepul.com/admin/integrations` - Payment Gateways (Razorpay/Paytm) & Logistics Settings
- `https://teepul.com/admin/categories` - Categories & Fabrics Management
- `https://teepul.com/admin/users` - Registered Customers & Roles
- `https://teepul.com/admin/settings/general` - Store General Settings

---

## 🗄️ DATABASE SCHEMAS & KEY ENTITIES (`prisma/schema.prisma`)

### 1. `User` Model
```prisma
model User {
  id           String    @id @default(uuid())
  email        String    @unique
  username     String    @unique
  phone        String?   @unique
  passwordHash String
  displayName  String
  avatar       String?
  bio          String?
  address      String?
  city         String?
  state        String?
  pincode      String?
  status       String    @default("active")
  roleId       String
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  role         Role      @relation(fields: [roleId], references: [id])
}
```

### 2. `Order` Model
```prisma
model Order {
  id              String      @id @default(uuid())
  orderNumber     String      @unique // e.g. ORD-10023
  customerName    String
  customerEmail   String
  customerPhone   String
  shippingAddress String
  pincode         String
  city            String?
  state           String?
  totalAmount     Float
  currency        String      @default("INR")
  paymentMethod   String      @default("RAZORPAY")
  paymentStatus   String      @default("PENDING") // PENDING, PAID, FAILED, COD_PENDING
  orderStatus     String      @default("PROCESSING") // PROCESSING, SHIPPED, DELIVERED, CANCELLED
  trackingNumber  String?     // e.g. EKART987654321IN
  courierPartner  String?     @default("EKart Logistics")
  trackingUrl     String?
  razorpayOrderId String?
  razorpayPaymentId String?
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  items           OrderItem[]
}
```

### 3. `OrderItem` Model
```prisma
model OrderItem {
  id           String   @id @default(uuid())
  orderId      String
  productId    String
  productTitle String
  color        String?  // e.g. Onyx Black, Ivory Cream
  size         String?  // e.g. 7ft Door, 9ft Long Door, 5ft Window
  unitPrice    Float
  quantity     Int      @default(1)
  totalPrice   Float
  order        Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

---

## 🛠️ COMPLETE CHRONOLOGICAL IMPLEMENTATION SUMMARY

1. **Initial Store Setup & Live Deployment**:
   - Connected `teepul.com` domain to Render.
   - Built Panipat Manufacturing Unit showcase section, top sellers, and new arrivals.
   - Configured SQLite database with Prisma ORM.

2. **Admin Credentials & Password Security**:
   - Updated Admin credentials to `govinda755rock755@gmail.com` / `Govinda@755`.
   - Hidden Admin registration and public admin buttons. Admin portal isolated at `/admin/login`.

3. **Google Sign-In & Customer Email Authentication**:
   - Integrated Firebase Google Auth (`teepul-official` project under `teepul755@gmail.com`).
   - Built `/api/auth/google-login.ts` and `/api/auth/customer-register.ts`.
   - Customer login updated at `/login` with Google Sign-In and Customer Email tabs.

4. **Customer Account Dashboard (`/account`) & Logout**:
   - Built `/account` with editable customer profile form (Name, Phone, Address, City, State, Pincode).
   - Saved profile changes via `/api/account/update-profile.ts`.
   - Added Order History list with live package tracking status.
   - Created `/api/auth/logout.ts` API endpoint to safely destroy session tokens and clear cookies.

5. **Fast Add to Cart & Header Counter**:
   - Added `🛒 +Add` buttons on product cards.
   - Added dynamic `#cart-badge-count` in header navigation with `localStorage` cart sync and toast alerts.

6. **Admin Sidebar Clean-Up & Curtain Order Specifications**:
   - Removed unused items: Media Library, Tags, Themes & Menus, Plugins, Comments.
   - Tailored Admin Orders view (`/admin/orders`) for Curtain Seller operations: Customer Name, Phone, Address, Curtain Color, Curtain Size, and direct product page links (`🔗 View Ordered Product Page ↗`).

7. **EKart Logistics Courier Booking Integration**:
   - Built EKart shipping rate estimator based on destination pincode (₹55 - ₹85).
   - Built `/api/admin/book-ekart.ts` API endpoint: Generates AWB tracking number (`EKART...IN`), updates order status to `SHIPPED`, and generates direct live tracking URL.

8. **Day-by-Day Order Filters & Permanent Records**:
   - Added Date Filter Buttons (All Time, Today, Yesterday, Last 7 Days, This Month).
   - Added Fulfillment Status dropdown & Search input on `/admin/orders`.
   - Ensured all orders remain permanently saved and searchable in SQLite DB.
