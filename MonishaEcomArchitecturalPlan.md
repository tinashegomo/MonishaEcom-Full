# Implementation Plan: Monisha E-Commerce ↔ IMS Architecture (Final)

## 0. Summary of Architecture Decisions

- **IMS is the single source of truth** for products, stock, customers, and orders. No other service ever writes to `product_entity`, `product_size_entity`, `customer_entity`, `orders`, or `order_item_entity`.
- **The ecom backend is a separate, independently deployed service** that owns only three concerns: customer login (`CustomerUserEntity`), cart (`CartEntity`/`CartItemEntity`), and wishlist (`WishlistEntity`).
- **No shared database connection.** The ecom backend never connects to the IMS MySQL instance. All interaction happens over HTTP, server-to-server.
- **Customer identity is resolved once, at ecom registration** — not lazily at checkout. `CustomerUserEntity` stores `imsCustomerId`, `customerName`, and `phoneNumber` from the moment of signup.
- **Order creation and order numbering are never duplicated.** The public order endpoint on IMS delegates to the exact same `OrderService.createOrder(...)` method the staff/counter flow uses, so ecom orders and counter orders share one sequence, one transaction boundary, and one set of business rules.
- **Three scoped API keys**, not one blanket key, gate the three IMS-side write/read concerns the ecom backend needs: `ecom-catalog`, `ecom-customers`, `ecom-orders`. Each grants a distinct authority on the IMS side.

---

## 1. Final Ownership Map

| Concern | Owner | Entity/Table |
|---|---|---|
| Products & stock | IMS | `ProductEntity`, `ProductSizeEntity`, `WarehouseBatchEntity`, `WarehouseBatchSizeEntity` |
| Customers | IMS | `CustomerEntity` |
| Orders | IMS | `OrderEntity`, `OrderItemEntity` |
| Schools | IMS | `SchoolEntity` |
| Staff/admin auth | IMS | existing `UserEntity` + JWT (`ROLE_ADMIN` etc.) |
| Customer login (ecom) | Ecom | `CustomerUserEntity` |
| Cart | Ecom | `CartEntity`, `CartItemEntity` |
| Wishlist | Ecom | `WishlistEntity` |

---

## 2. Why the Database Is Not Shared

The original plan had the ecom backend connect directly to the same `monisha_inventory` MySQL database IMS uses — same host, same credentials, same tables — with its own set of JPA entity classes (`ProductEntity`, `OrderEntity`, etc.) mapped onto those same tables.

The problem: Hibernate in the ecom app has no idea Hibernate in the IMS app exists. Each application believes it is the sole owner of that schema. If the two entity definitions ever drift apart — a column type differs by one character, a field gets renamed in one codebase but not the other — `ddl-auto=update` can try to "correct" the schema on startup and corrupt indexes or columns that the other application depends on. There is no safeguard against this; it is two independent processes editing one shared filing cabinet with no coordination.

**The fix:** the ecom backend gets its own, completely separate database. It contains only `customer_user`, `cart`, `cart_item`, `wishlist` — nothing else. It has no connection string pointing at IMS's MySQL instance, no JDBC driver configured for it, and no entity classes for `ProductEntity`, `OrderEntity`, `CustomerEntity`, or anything else IMS owns. If you opened the ecom database in a MySQL client, IMS's tables would not exist there at all.

**Analogy:** IMS is a shop with a stockroom (its database) and a counter (its API). The old plan handed the ecom backend its own key to the stockroom, letting it go in and move things around on the same shelves IMS uses. The new plan has the ecom backend walk up to the counter instead — it asks IMS for what it needs and lets IMS's own staff (its own service/repository layer) handle the stockroom. The ecom backend never goes back there.

---

## 3. What "Over HTTP" Actually Means

Since the ecom backend has no database connection to IMS, the only way it gets product data, resolves a customer, or creates an order is by acting as an **HTTP client** — the exact same mechanism your React frontend already uses to talk to IMS today, just with one Spring Boot application calling another instead of a browser calling a server.

Concretely:
1. IMS exposes REST endpoints (`GET /api/public/products`, `POST /api/public/orders`, etc.) — these already run inside the IMS Spring Boot app, on IMS's server, backed by IMS's database.
2. The ecom backend's `ImsClient` service makes an outbound HTTP request to those endpoints (using `RestClient` or `WebClient`), the same way `axios` in your React app makes a request to IMS today.
3. The request carries a header (`X-Internal-Api-Key`) instead of a customer's JWT, since this is a server identifying itself to another server, not a logged-in user.
4. IMS's controller receives the request, runs its normal service-layer logic against its own database, and sends back a JSON response.
5. The ecom backend reads that JSON response and continues its own logic (e.g. saving the returned `customerId` onto a local `CustomerUserEntity` row) — but it never touches IMS's tables directly. It only ever sees whatever JSON IMS chooses to hand back.

This is a synchronous, request-then-wait call — same as any API call you've already built. Nothing new conceptually; the only shift is *which* application is making the request.

---

## 4. Full Walkthrough: From Product Selection to Successful Order

### Step 1 — Shopper browses the catalog
The ecom frontend calls the ecom backend (or IMS directly), which calls IMS:

```
GET /api/public/products
Header: X-Internal-Api-Key: <ecom-catalog key>
```

IMS responds with data pulled straight from `product_entity` / `product_size_entity` — nothing ecom-specific involved yet:

```json
[
  {
    "productId": 41,
    "productName": "School Blazer",
    "unitPrice": 35.00,
    "sizes": [
      { "sizeId": 101, "size": "M", "quantityAvailable": 12 },
      { "sizeId": 102, "size": "L", "quantityAvailable": 4 }
    ]
  }
]
```

### Step 2 — Shopper selects a product and size, adds to cart
This is **entirely local to the ecom backend** — no call to IMS happens here. The ecom backend writes a `CartItemEntity` row referencing `imsProductId: 41`, `imsProductSizeId: 101`, `quantity: 2`, plus a denormalized `unitPrice`/`productName` snapshot for display.

### Step 3 — Shopper registers (if not already)
```
POST /api/shop/auth/register   (ecom backend's own endpoint)
Body: { "name": "Tendai Moyo", "phone": "+263771234567", "email": "t@x.com", "password": "..." }
```
Internally, the ecom backend calls IMS:
```
POST /api/public/customers
Header: X-Internal-Api-Key: <ecom-customers key>
Body: { "customerName": "Tendai Moyo", "phoneNumber": "+263771234567" }
```
IMS responds:
```json
{ "customerId": 217, "customerName": "Tendai Moyo", "phoneNumber": "+263771234567" }
```
The ecom backend saves `imsCustomerId: 217` onto the new `CustomerUserEntity` row and issues its own `ROLE_CUSTOMER` JWT back to the shopper. This is the **only** point identity resolution ever happens.

### Step 4 — Shopper checks out
```
POST /api/shop/orders/checkout   (ecom backend's own endpoint, customer JWT required)
```
The ecom backend already knows `imsCustomerId: 217` from the logged-in `CustomerUserEntity` — no lookup needed. It calls IMS:
```
POST /api/public/orders
Header: X-Internal-Api-Key: <ecom-orders key>
Body: {
  "customerId": 217,
  "orderItems": [
    { "productId": 41, "sizeId": 101, "quantity": 2 }
  ],
  "paidAmount": 0,
  "notes": "Ecom order"
}
```

### Step 5 — IMS processes the order
Inside one `@Transactional` method (the same `OrderService.createOrder(...)` staff use):
- Validates `customerId` 217 exists.
- Checks stock: size 101 has 12 available, order wants 2 → passes.
- Deducts stock: 12 → 10.
- Creates the `OrderEntity` + `OrderItemEntity` rows, generates the next order number in the same sequence as counter orders.

IMS responds:
```json
{
  "orderId": 933,
  "orderNumber": "ORD-0934",
  "customerId": 217,
  "status": "PENDING",
  "totalAmount": 70.00,
  "balance": 70.00,
  "orderItems": [
    { "productId": 41, "size": "M", "quantity": 2, "unitPrice": 35.00 }
  ]
}
```

### Step 6 — Order is now visible everywhere it needs to be
- **IMS staff dashboard** shows order `ORD-0934` immediately — it's a normal row in `orders`, indistinguishable from a counter sale except that it came from the ecom API path.
- **Ecom backend** clears the shopper's cart and shows a confirmation using the response above.
- **Ecom "my orders" page** later calls `GET /api/public/customers/217/orders` and gets this order back alongside any future ones — no local order table on the ecom side ever stores it.

At no point did the ecom backend open a database connection to IMS's MySQL instance — every one of these steps was a JSON request and a JSON response between two independently running applications.

---

## Phase 1 — IMS Backend: Scoped API Key Security Infrastructure

### Task 1.1: API key configuration
Add to `application-prod.properties` / `application-local.properties`:
```properties
service.api-keys.ecom-catalog=${ECOM_CATALOG_KEY}
service.api-keys.ecom-customers=${ECOM_CUSTOMERS_KEY}
service.api-keys.ecom-orders=${ECOM_ORDERS_KEY}
```
Each key is a long random string generated once, stored as an env var on both IMS and ecom deployments (Render env vars in prod, `application-local.properties` locally — never committed).

**Scope:** XS

### Task 1.2: `ApiKeyAuthFilter`
A `OncePerRequestFilter` that:
1. Reads `X-Internal-Api-Key` from the request header.
2. Looks it up against the three configured keys.
3. On match, sets an authenticated `UsernamePasswordAuthenticationToken` in the `SecurityContext` with the corresponding authority: `ROLE_SERVICE_CATALOG`, `ROLE_SERVICE_CUSTOMERS`, or `ROLE_SERVICE_ORDERS`.
4. On no match (and the path requires auth), returns 401 and does not continue the filter chain.

**Scope:** S

### Task 1.3: Second `SecurityFilterChain` for `/api/public/**`
Register a second chain, ordered *before* the existing staff JWT chain, matched by `securityMatcher("/api/public/**")`, using `ApiKeyAuthFilter` instead of the staff `JwtAuthFilter`. Per-path authority requirements:
- `/api/public/products/**` → open, or `ROLE_SERVICE_CATALOG` if you want it locked (read-only either way).
- `/api/public/customers/**` → `ROLE_SERVICE_CUSTOMERS`.
- `/api/public/orders/**` → `ROLE_SERVICE_ORDERS`.

This keeps staff JWT auth and service-key auth completely isolated — neither can be used to access the other's endpoints.

**Scope:** M

---

## Phase 2 — IMS Backend: Public Endpoints

### Task 2.1: Public product catalog
- `GET /api/public/products` — list sellable products, delegates to existing `ProductService.getAllProducts()`.
- `GET /api/public/products/{id}` — product detail with active sizes/stock, delegates to existing `ProductService.getProductById(id)`.
- New controller, no new service logic — this is a read-only pass-through.

**Scope:** S

### Task 2.2: Public customer resolution
- `POST /api/public/customers` — body `{ customerName, phoneNumber }`.
- Delegates to `CustomerService.createCustomer(...)`, the same method staff use.
- **Add idempotency**: before creating, look up by `phoneNumber`. If a `CustomerEntity` already exists with that phone, return it instead of creating a duplicate. This requires one new repository method (`findByPhoneNumber`) shared by both the staff and public paths.
- Returns `{ customerId, customerName, phoneNumber }`.
- Secured by `ROLE_SERVICE_CUSTOMERS`.

**Scope:** S

### Task 2.3: Public order creation
- `POST /api/public/orders` — body shape mirrors the existing `OrderRequestDTO` (`customerId`, `orderItems`, `paidAmount`, `notes`, `schoolId`), minus any staff-only fields.
- Validates `customerId` exists (404 if not — defends against a stale or tampered id from the ecom side).
- **Delegates to the exact same `OrderService.createOrder(...)`** the staff controller calls. Same `@Transactional` boundary, same stock-check-and-deduct logic, same order number generation, same `OrderStatus.PENDING` default.
- Secured by `ROLE_SERVICE_ORDERS`.

**Scope:** M (mostly wiring — the hard logic already exists)

### Task 2.4: Public order history
- `GET /api/public/customers/{customerId}/orders` — delegates to existing order repository/service query filtered by customer.
- Secured by `ROLE_SERVICE_ORDERS` (still customer-specific data).

**Scope:** S

---

## Phase 3 — Ecom Backend: Project Foundation

### Task 3.1: Project setup
- New Spring Boot project (`MonishaEcomBackend`), own database (or own schema) — no connection to IMS's MySQL instance at all.
- `pom.xml`: Spring Web, Spring Data JPA, Spring Security, JWT library, Lombok, MapStruct, validation, MySQL/Postgres connector (whichever you pick for the ecom DB).
- `application-local.properties` / `application-prod.properties`: own DB connection, own JWT secret (customer-facing, separate from IMS's staff JWT secret), the three IMS API keys, IMS base URL.

**Scope:** S

### Task 3.2: `ImsClient` foundation
A single `@Service` wrapping `RestClient`/`WebClient`, with per-method key attachment:
```java
class ImsClient {
    List<ProductDTO> getAllProducts();                                  // ecom-catalog
    ProductDTO getProductById(Long id);                                 // ecom-catalog
    CustomerDTO findOrCreateCustomer(String name, String phone);        // ecom-customers
    OrderDTO createOrder(Long customerId, List<OrderItemDTO> items, ...); // ecom-orders
    List<OrderDTO> getOrdersByCustomer(Long customerId);                // ecom-orders
}
```
Each method sets `X-Internal-Api-Key` to the matching configured value before calling IMS.

**Scope:** M

---

## Phase 4 — Ecom Backend: Entities

### Task 4.1: `CustomerUserEntity`
Fields: `id`, `email` (unique), `hashedPassword`, `imsCustomerId`, `customerName`, `phoneNumber`, `createdAt`. No relationship to a local customer table — `imsCustomerId` is a plain reference to IMS's `CustomerEntity.id`.

**Scope:** S

### Task 4.2: `CartEntity` / `CartItemEntity`
- `CartEntity`: `id`, `customerUserId` (FK to local `CustomerUserEntity`), `createdAt`, `updatedAt`.
- `CartItemEntity`: `id`, `cartId`, `imsProductId`, `imsProductSizeId` (or size string), `quantity`, and a denormalized `unitPrice`/`productName` snapshot refreshed on cart view (via `ImsClient.getProductById`) so totals don't silently drift from IMS pricing.

**Scope:** M

### Task 4.3: `WishlistEntity`
Fields: `id`, `customerUserId`, `imsProductId`, `addedAt`. Simple join-style entity — no price snapshotting needed.

**Scope:** S

---

## Phase 5 — Ecom Backend: Customer Security

### Task 5.1: Customer JWT engine
Replicate the JWT signing/parsing pattern from IMS (`JWTUtils`), scoped entirely to the ecom backend, issuing tokens under `ROLE_CUSTOMER`. Completely separate secret and separate `SecurityConfig` from IMS's staff auth — the two systems never validate each other's tokens.

**Scope:** M

### Task 5.2: Registration & login
- `POST /api/shop/auth/register` — body `{ name, phone, email, password }`:
  1. Call `imsClient.findOrCreateCustomer(name, phone)` → get `{ customerId, customerName, phoneNumber }`.
  2. Create `CustomerUserEntity` with `email`, hashed password, and the returned `imsCustomerId`/`customerName`/`phoneNumber`.
  3. Issue a `ROLE_CUSTOMER` JWT, return it to the client.
- `POST /api/shop/auth/login` — standard email/password check against `CustomerUserEntity`, issue JWT.

**Scope:** M

---

## Phase 6 — Ecom Backend: Catalog, Cart, Wishlist

### Task 6.1: Catalog proxy
- `GET /api/shop/products`, `GET /api/shop/products/{id}` — thin pass-through to `imsClient.getAllProducts()` / `getProductById()`. (Alternative: skip the proxy and have the React frontend call IMS's public catalog endpoints directly — either works; proxying keeps one API boundary for the frontend to talk to.)

**Scope:** S

### Task 6.2: Cart service & controller
Standard CRUD: add item, update quantity, remove item, view cart (refreshing price/name snapshot from IMS on read), clear cart.

**Scope:** M

### Task 6.3: Wishlist service & controller
Standard CRUD: add, remove, list. List view can optionally enrich with live product data via `ImsClient` for display.

**Scope:** S

---

## Phase 7 — Ecom Backend: Checkout & Order History

### Task 7.1: Checkout flow
```java
CustomerUserEntity customer = getCurrentCustomerUser(); // from ecom JWT

OrderDTO order = imsClient.createOrder(
    customer.getImsCustomerId(),
    customer.getCustomerName(),
    customer.getPhoneNumber(),
    cartItemsToOrderItems(cart)
);

cartRepo.clear(cart);
```
No conditional branching — identity is already resolved from registration. On IMS error (e.g. out of stock), surface the error back to the customer without clearing the cart.

**Scope:** M

### Task 7.2: Order history proxy
- `GET /api/shop/orders/my-orders` — calls `imsClient.getOrdersByCustomer(customer.getImsCustomerId())`, returns result directly. No local order table.

**Scope:** S

---

## Recommended Build Order

1. **Phase 1** (IMS security infra) — everything else depends on this existing first.
2. **Phase 2** (IMS public endpoints) — build and test with Postman/curl using a hardcoded API key before touching the ecom backend at all.
3. **Phase 3–4** (ecom project + entities) — can be built and unit-tested in isolation, no IMS dependency yet.
4. **Phase 5** (ecom auth + registration) — first point where ecom actually calls IMS (`findOrCreateCustomer`). Test this end-to-end before moving on.
5. **Phase 6** (catalog/cart/wishlist) — cart and wishlist have zero IMS dependency; catalog proxy is a thin read.
6. **Phase 7** (checkout + order history) — the final integration point, depends on everything above working.

---

## Verification Checkpoints

**Checkpoint 1 — IMS scoped auth**
- Call `/api/public/products` with the `ecom-catalog` key → 200.
- Call `/api/public/orders` with the `ecom-catalog` key (wrong scope) → 403. Confirms scoping actually restricts, not just "any key works."

**Checkpoint 2 — Customer idempotency**
- `POST /api/public/customers` twice with the same phone number → second call returns the same `customerId`, no duplicate row in `customer_entity`.

**Checkpoint 3 — Shared order sequence**
- Create one order via the IMS staff frontend, one via ecom checkout, back to back → order numbers are sequential with no collision, same table, same counter.

**Checkpoint 4 — End-to-end ecom flow**
- Register → `imsCustomerId` gets set and cached correctly.
- Browse catalog → matches what's live in IMS.
- Add to cart, checkout → stock decrements in IMS, order appears on the IMS staff dashboard with correct customer, `/my-orders` on ecom returns it.
- Attempt to buy an out-of-stock size → fails cleanly, cart is preserved, no partial state.

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| API key leakage (e.g. committed to git, logged) | High | Keys only ever in env vars, never in properties files committed to source control. Rotate immediately if leaked — each scope can be rotated independently without affecting the others. |
| Ecom backend calls IMS while IMS is down/slow | Medium | Checkout and registration should surface a clear "try again" error rather than a silent failure; no local fallback writes that could desync from IMS. |
| Duplicate customer records despite idempotency check | Low-Medium | Phone number lookup must happen inside the same transaction as creation to avoid a race between two near-simultaneous registration calls with the same phone. |
| Order number collision between staff and ecom paths | Low | Eliminated by construction — both paths call the same `OrderService.createOrder(...)` method, so there is only one counter/sequence in the codebase, not two. |
| Cart price drift from IMS catalog changes | Medium | Cart view always re-fetches current price/stock from IMS before checkout confirmation, rather than trusting a stale snapshot taken when the item was added. |

---

## Open Questions

1. **Cart persistence for guests** — should browsing/adding to cart be allowed before registration (stored client-side or against a temporary session), or is login required before anything touches `CartEntity`?
2. **Stock check on cart view vs. checkout only** — should the cart page show a live "only 2 left" warning (extra `ImsClient` calls on every cart view), or should stock only be checked at the moment of checkout?
3. **Failed checkout messaging** — when IMS rejects an order for insufficient stock, does the customer see a generic "out of stock" message, or per-item detail on which size/quantity failed?