# Tech Context — Monisha E-Commerce Backend

## Stack Overview

| Layer | Technology | Version |
|---|---|---|
| Backend framework | Spring Boot | 4.0.7 |
| Language | Java | 21 |
| Build | Maven | (Spring Boot parent) |
| ORM | Spring Data JPA (Hibernate) | (managed) |
| Database | MySQL | 8.x (own schema, not IMS's) |
| Auth | JWT (jjwt) | jjwt 0.12.5 |
| Mapping | MapStruct | 1.5.5.Final |
| Boilerplate | Lombok | (managed) |
| HTTP Client | RestClient | (Spring Boot built-in) |

## Repository Layout

```
MonishaEcomBackend/
├── pom.xml
├── MonishaEcomArchitecturalPlan.md
├── memory-bank/
├── backend/
│   └── MonishaInventoryManagementSystem/   ← IMS (separate project)
├── MonishaEcomBackend/
│   └── src/main/java/com/tinasheGomo/MonishaEcomBackend/
│       ├── MonishaEcomBackendApplication.java
│       ├── config/
│       ├── controller/
│       │   ├── auth/        ← CustomerAuthController
│       │   ├── cart/        ← CartController
│       │   ├── wishlist/    ← WishlistController
│       │   ├── product/     ← ProductController (proxy to IMS)
│       │   └── order/       ← CustomerOrderController
│       ├── dto/
│       ├── entity/
│       │   ├── user/        ← CustomerUserEntity
│       │   ├── cart/        ← CartEntity, CartItemEntity
│       │   └── wishlist/    ← WishlistEntity
│       ├── enums/
│       ├── exception/
│       ├── mapper/
│       ├── repository/
│       ├── security/        ← JWT, AuthFilter, SecurityConfig
│       └── service/
│           ├── auth/        ← CustomerAuthService
│           ├── cart/        ← CartService
│           ├── wishlist/    ← WishlistService
│           ├── product/     ← ProductService (proxy)
│           └── order/       ← CustomerOrderService
└── documentation/
```

## Backend Configuration

### application.properties (unchanged from scaffold)
```
spring.application.name=MonishaEcomBackend
```

### application-local.properties
```
spring.datasource.url=jdbc:mysql://localhost:3306/monisha_ecom
spring.datasource.username=root
spring.datasource.password=pass
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

SecretJwtString=<unique ecom JWT secret>

ims.base-url=http://localhost:8080
ims.api-keys.ecom-catalog=<catalog-key>
ims.api-keys.ecom-customers=<customers-key>
ims.api-keys.ecom-orders=<orders-key>
```

### application-prod.properties
```
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}

SecretJwtString=${JWT_SECRET}

ims.base-url=${IMS_BASE_URL}
ims.api-keys.ecom-catalog=${ECOM_CATALOG_KEY}
ims.api-keys.ecom-customers=${ECOM_CUSTOMERS_KEY}
ims.api-keys.ecom-orders=${ECOM_ORDERS_KEY}
```

## API Contract (Ecom Backend)

**Base path:** `/api/shop`

### Auth (public)
- `POST /api/shop/auth/register` — body: `{ name, phone, email, password }` → `AuthResponseDTO { token, customerUserId, email, imsCustomerId, customerName }`
- `POST /api/shop/auth/login` — body: `{ email, password }` → `AuthResponseDTO`

### Products (authenticated)
- `GET /api/shop/products` — proxies to IMS `/api/public/products`
- `GET /api/shop/products/{id}` — proxies to IMS `/api/public/products/{id}`

### Cart (authenticated)
- `GET /api/shop/cart` — get current cart with items
- `POST /api/shop/cart/items` — add item `{ productId, size, quantity }`
- `PUT /api/shop/cart/items/{itemId}` — update quantity `{ quantity }`
- `DELETE /api/shop/cart/items/{itemId}` — remove item
- `DELETE /api/shop/cart` — clear cart

### Wishlist (authenticated)
- `GET /api/shop/wishlist` — get wishlist items
- `POST /api/shop/wishlist/items` — add item `{ productId }`
- `DELETE /api/shop/wishlist/items/{itemId}` — remove item

### Orders (authenticated)
- `POST /api/shop/orders/checkout` — body: `{ paymentType: CARD|MOBILE_MONEY, paidAmount: BigDecimal, notes }` → `OrderResponseDTO` (IMS enforces 40% minimum for CARD/MOBILE_MONEY)
- `GET /api/shop/orders/my-orders` — order history

## Auth Flow

1. Customer registers → ecom backend calls IMS `POST /api/public/customers` → gets `imsCustomerId`
2. `CustomerUserEntity` saved with `imsCustomerId`, `customerName`, `phoneNumber`
3. Ecom JWT issued with `ROLE_CUSTOMER`
4. On checkout, ecom backend calls IMS `POST /api/public/orders` with `imsCustomerId`
5. IMS processes order using same `OrderService.createOrder()` as staff

## IMS Communication

- `ImsClient` uses Spring `RestClient`
- Each request carries `X-Internal-Api-Key` header with scoped key
- Three scopes: `ecom-catalog` (read products), `ecom-customers` (create customers), `ecom-orders` (create/view orders)

## Known Issues

1. IMS `application-local.properties` JWT secret is base64-encoded but `JWTUtils` uses raw bytes — potential mismatch
2. IMS `OrderService.createOrder()` calls `SecurityUtils.getCurrentUser()` which requires a staff JWT in SecurityContext — public endpoints need to bypass this or provide a service identity
