# System Patterns — Monisha E-Commerce Backend

## 1. Architecture: Two-Service, HTTP-Only Communication

```
┌─────────────────────┐         ┌─────────────────────┐
│   ECOM BACKEND      │  HTTP   │   IMS BACKEND       │
│   (own DB)          │────────→│   (own DB)          │
│                     │  X-Api  │                     │
│ - CustomerUser      │  Key    │ - Products/Stock    │
│ - Cart/Wishlist     │         │ - Customers         │
│                     │         │ - Orders            │
└─────────────────────┘         └─────────────────────┘
```

- No shared database
- No entity duplication
- All IMS interaction via `ImsClient` HTTP calls
- Scoped API keys for authentication between services

## 2. Backend Layering

```
Controller → Service → Repository → Entity
   (HTTP)     (logic)     (JPA)     (persistence)
```

- Controllers handle HTTP ↔ DTO translation
- Services hold business logic
- Repositories are `JpaRepository<Entity, UUID>`
- Entities use UUID PKs, `@PrePersist`/`@PreUpdate` timestamps

## 3. Ecom-Only Entities

| Entity | Table | Purpose |
|---|---|---|
| `CustomerUserEntity` | `customer_user` | Auth credentials + IMS customer reference |
| `CartEntity` | `cart` | One cart per customer |
| `CartItemEntity` | `cart_item` | Items in cart with denormalized product info |
| `WishlistEntity` | `wishlist` | One wishlist per customer |

## 4. IMS Entities (read-only from ecom perspective)

The ecom backend does NOT have these entities. It accesses IMS data via HTTP:
- `ProductEntity`, `ProductSizeEntity` — product catalog
- `OrderEntity`, `OrderItemEntity` — order creation and history
- `CustomerEntity` — customer resolution (created during registration)
- `WarehouseBatchEntity`, `SchoolEntity` — product metadata

## 5. Security Pattern

- Separate `SecurityConfig` for ecom (customer-facing)
- `ROLE_CUSTOMER` for ecom users (distinct from IMS staff roles)
- JWT issued by ecom backend, validated by ecom backend
- IMS validates via `X-Internal-Api-Key` header, not customer JWT

## 6. Order Flow

1. Customer clicks checkout
2. Ecom frontend sends `{ paymentType, paidAmount, notes }` to ecom backend
3. Ecom backend reads cart items, calls IMS `POST /api/public/imsClient/orders` with `{ customerId, orderItems, paidAmount, paymentType, notes }`
4. IMS `OrderService.createOrder()`:
   - Validates `paidAmount` does not exceed total
   - For CARD/MOBILE_MONEY: validates `paidAmount` ≥ 40% of total
   - Calculates `balance = total - paidAmount`
   - Sets `fullyPaid = (balance == 0)`
   - Stores `paymentType` on the order
5. IMS returns `OrderResponseDTO` with order number, financial summary, paymentType
6. Ecom backend clears cart, returns confirmation to customer

## 7. Things to NOT Do

- Do not create entity classes for IMS tables in the ecom backend
- Do not connect ecom backend to IMS's MySQL database
- Do not duplicate order creation logic — delegate to IMS
- Do not store cart/wishlist in IMS database
- Do not use IMS staff JWT for ecom customer auth
