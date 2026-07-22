# Project Brief — Monisha E-Commerce Backend

## What This Is

A Spring Boot backend for the Monisha E-Commerce web app. It serves as the customer-facing API for browsing products, managing carts/wishlists, customer authentication, and placing orders. Product data and order fulfillment are handled by the IMS (Inventory Management System) via server-to-server HTTP calls.

## Business Context

- **Domain:** E-commerce (school uniforms)
- **Customer base:** Online shoppers browsing the Monisha catalog
- **Architecture:** Two independent services communicating over HTTP
  - **IMS** — owns products, stock, customers, orders (single source of truth)
  - **Ecom Backend** — owns customer login, cart, wishlist (separate database)
- **No shared database** — ecom backend never connects to IMS's MySQL instance
- **All product/order operations** go through IMS public API endpoints via `ImsClient`

## Goals

1. **Separate customer auth** — `CustomerUserEntity` with `ROLE_CUSTOMER`, independent from IMS staff roles
2. **Cart & wishlist** — database-persisted, login required
3. **Order placement** — delegates to IMS `OrderService.createOrder()` via HTTP, same order sequence as counter orders
4. **Clean separation** — ecom backend has zero entity classes for IMS tables

## Non-Goals (for v1)

- Product management (IMS handles this)
- Stock management (IMS handles this)
- Staff/admin functionality
- Payment gateway integration
- Guest cart (login required)

## Architecture Diagram

```
Ecom Frontend (React)
    │
    ├── GET /products ──────→ IMS API (port 8080) via /api/public/products
    │
    ├── Cart/Wishlist/Auth ──→ Ecom API (port 8081)
    │
    └── Place Order ─────────→ Ecom API (port 8081)
                                  │
                                  └──→ ImsClient → IMS /api/public/orders
                                        │
                                        ↓
                                  IMS processes order (same as staff flow)
                                  Stock deducted, order created
                                  Staff sees order in IMS dashboard
```

## Documentation

- `MonishaEcomArchitecturalPlan.md` — full architectural plan
- `documentation/backend_documentation.md` — IMS architecture reference
