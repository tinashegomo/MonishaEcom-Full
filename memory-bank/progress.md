# Progress — Monisha E-Commerce Backend

## Status Legend
- [x] Done
- [~] In progress
- [ ] Not started

---

## IMS Backend Changes

### Phase 1: API Key Security
- [x] Task 1.1: Add API key config to IMS application properties
- [x] Task 1.2: Create `ApiKeyAuthFilter`
- [x] Task 1.3: Create second `SecurityFilterChain` for `/api/public/**`

### Phase 2: Public Endpoints
- [x] Task 2.1: `GET /api/public/products` — product catalog
- [x] Task 2.2: `GET /api/public/products/{id}` — product detail
- [x] Task 2.3: `POST /api/public/customers` — customer resolution (idempotent by phone)
- [x] Task 2.4: `POST /api/public/orders` — order creation (delegates to OrderService)
- [x] Task 2.5: `GET /api/public/orders/customer/{id}` — order history

---

## Ecom Backend

### Phase 3: Foundation
- [x] Task 3.1: Add dependencies to pom.xml (MapStruct, JWT)
- [x] Task 3.2: Create `application-local.properties` (own DB, JWT secret, IMS keys)
- [x] Task 3.3: Create `application-prod.properties` (env vars)
- [x] Task 3.4: Create `ImsClient` service

### Phase 4: Entities
- [x] Task 4.1: `CustomerUserEntity`
- [x] Task 4.2: `CartEntity` + `CartItemEntity`
- [x] Task 4.3: `WishlistEntity`

### Phase 5: Customer Auth
- [x] Task 5.1: JWT engine (sign/validate)
- [x] Task 5.2: `SecurityConfig` + `AuthFilter`
- [x] Task 5.3: Register endpoint (calls IMS for customer)
- [x] Task 5.4: Login endpoint

### Phase 6: Catalog, Cart, Wishlist
- [x] Task 6.1: Product proxy controller
- [x] Task 6.2: Cart service + controller
- [x] Task 6.3: Wishlist service + controller

### Phase 7: Checkout & Orders
- [x] Task 7.1: Checkout flow (calls IMS order creation)
- [x] Task 7.2: Order history proxy

---

## Ecom Frontend (MonishaEcom)

### Phase 8: Foundation
- [x] Task 8.1: Initialize React + Vite + Tailwind v4 project
- [x] Task 8.2: Design system in `index.css` (brand tokens, semantic aliases, animations)
- [x] Task 8.3: Axios API client with interceptors (`EcomAPI.js`)
- [x] Task 8.4: TanStack Query hooks (`EcomHooks.js`)
- [x] Task 8.5: JWT token utilities (`tokenUtils.js`)
- [x] Task 8.6: Install framer-motion

### Phase 9: Layout & Auth
- [x] Task 9.1: NavLinks, TopNav (desktop), BottomNav (mobile)
- [x] Task 9.2: MainLayout, AuthLayout
- [x] Task 9.3: ProtectedRoute
- [x] Task 9.4: LoginForm, RegisterForm
- [x] Task 9.5: Login page, Register page

### Phase 10: Products
- [x] Task 10.1: ProductCard (gradient initials, framer-motion hover scale, spring wishlist, morph button)
- [x] Task 10.2: ProductList (responsive grid with skeleton loading)
- [x] Task 10.3: Products page (search, filters, sort)
- [x] Task 10.4: ProductDetails page (size selector, quantity, add-to-cart/wishlist, related)

### Phase 11: Landing Page
- [x] Task 11.1: Hero with staggered framer-motion entrance
- [x] Task 11.2: Stitch-line brand motif under "Success"
- [x] Task 11.3: Scroll-reveal on features, schools, types, featured products, CTA
- [x] Task 11.4: Staggered grid animations for school/type cards

### Phase 12: Cart & Wishlist
- [x] Task 12.1: Cart page (line items, quantity steppers, remove, clear all, order summary)
- [x] Task 12.2: Wishlist page (product cards, move-to-cart, animated removal)

### Phase 13: Checkout & Orders
- [x] Task 13.1: Checkout page (payment type selector, notes, order summary)
- [x] Task 13.2: Checkout success page (animated checkmark, CTAs)
- [x] Task 13.3: My Orders page (order list, status badges, expand-on-click)
- [x] Task 13.4: Order Details page (full order view, payment summary)

### Phase 14: Profile & App Wiring
- [x] Task 14.1: Profile page (avatar, quick links, account info, sign out)
- [x] Task 14.2: App.jsx — all routes wired with proper imports
- [x] Task 14.3: 404 page

### Phase 15: Layout Density Overhaul
- [x] Task 15.1: MainLayout — `min-h-dvh`, `container-grid pt-10 lg:pt-14 pb-12` wrapping `<Outlet />`, `pb-28 lg:pb-10`
- [x] Task 15.2: TopNav — 72px height, `backdrop-blur-xl bg-surface-default/90`, brand logo 220px min-w, wider `gap-3` nav links, 18px icons, pill active `bg-brand-subtle rounded-full`, 44px avatar, 220px user section, `rounded-panel` dropdown
- [x] Task 15.3: BottomNav — My Orders moved to More menu (Home/Products/Wishlist/Cart/More), h-[74px], 72px items, 22px icons, 11px labels, pill active `bg-brand-subtle rounded-xl`
- [x] Task 15.4: NavLinks — PRIMARY = Home/Products/Wishlist/Cart; DROPDOWN = Profile/My Orders
- [x] Task 15.5: AuthLayout — `max-w-lg`, `py-12`
- [x] Task 15.6: Expose `--radius-input`, `--radius-panel`, `--radius-pill` in `@theme inline`
- [x] Task 15.7: Remove `container-grid` from all individual pages (LandingPage, Products, ProductDetails, Cart, Wishlist, Checkout, MyOrders, OrderDetails, Profile)
- [x] Task 15.8: Build passes clean

### Phase 16: Wishlist & ProductCard Polish
- [x] Task 16.1: ProductCard wishlist state synced with `useGetWishlist()` — filled red heart when product is in wishlist, outline when not; click toggles add/remove
- [x] Task 16.2: Wishlist page hover overlay — Add to Cart + Eye buttons appear on hover (floating white bar, no dark overlay)
- [x] Task 16.3: Wishlist page star ratings increased to `w-5 h-5`
- [x] Task 16.4: Wishlist `<main>` wrapper removed — uses MainLayout spacing
- [x] Task 16.5: ProductDetails `<main>` wrapper removed — uses MainLayout spacing
- [x] Task 16.6: MyOrders, OrderDetails, Checkout — `container-grid py-12 lg:py-16` removed
- [x] Task 16.7: MainLayout padding changed from `py-8` to `pt-10 lg:pt-14 pb-12` for consistent spacing
- [x] Task 16.8: Build passes clean

### Phase 17: Payment System & Checkout Redesign
- [x] Task 17.1: IMS — Create `PaymentType` enum (CARD, MOBILE_MONEY, CASH)
- [x] Task 17.2: IMS — Add `paymentType` field to OrderEntity, OrderRequestDTO, OrderResponseDTO
- [x] Task 17.3: IMS — OrderService: set paymentType + 40% minimum payment validation for non-CASH
- [x] Task 17.4: Ecom — Update PaymentType enum to CARD, MOBILE_MONEY (removed CASH_ON_COLLECTION, PREPAID)
- [x] Task 17.5: Ecom — CustomerOrderService: use request.getPaidAmount() instead of hardcoding, pass paymentType to IMS
- [x] Task 17.6: Ecom — ImsClient: add paymentType to request body
- [x] Task 17.7: Ecom — Add paymentType to ImsOrderDTO and OrderResponseDTO + toOrderResponse mapping
- [x] Task 17.8: Frontend — Checkout.jsx full redesign: Card/Mobile Money options, partial payment input with 40% min, live progress bar, payment breakdown, modern UI
- [x] Task 17.9: Both backends compile clean, frontend builds clean

### Phase 18: CheckoutSuccess, My Orders & Order Details Redesign
- [x] Task 18.1: Checkout.jsx — Pass order data + cart items via `navigate('/checkout/success', { state: { order, cartItems, totalAmount } })`
- [x] Task 18.2: CheckoutSuccess.jsx — Full redesign matching reference layout: "Thanks For Ordering" heading, order metadata (Order ID, Date, Status), product rows with images, amount breakdown, Download Invoice button with PDF generation
- [x] Task 18.3: MyOrders.jsx — Modern card-based design: status icons (CheckCircle/Truck/Package/Clock/AlertCircle), colored status badges, order summary preview, hover state with ChevronRight, staggered entrance animations
- [x] Task 18.4: OrderDetails.jsx — Modern layout: back navigation, order header with status badge, meta grid (Items/Payment/Total/Balance), order items with product images, order summary with amount breakdown, Download Invoice button
- [x] Task 18.5: IMS Orders.jsx — Add Payment Type column to orders table (header + cell + balance cell)
- [x] Task 18.6: OrderDetails.jsx — Fix `useParams` to use `id` (matching route param `/my-orders/:id`)
- [x] Task 18.7: Both frontends build clean

---

## Build Status
- [x] IMS backend compiles clean
- [x] Ecom backend compiles clean
- [x] Ecom frontend builds clean (Vite + Tailwind v4 + framer-motion)
- [x] IMS frontend builds clean (Vite + Tailwind v4)

## Documentation
- [x] MonishaEcomArchitecturalPlan.md
- [x] memory-bank/* (all 5 files)
