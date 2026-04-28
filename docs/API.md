# API Endpoints

Full list of HTTP endpoints consumed by the frontend.

All authenticated endpoints require `Authorization: Bearer <access_token>` header (added automatically by `AxiosUtil`). Public routes are listed in `src/consts/api/publicApiRoutes`.

---

## Common shapes

### Request envelope for paginated list endpoints

```json
{
  "criteria": { "...": "domain-specific filters" },
  "sort_bys": [{ "field": "created_at", "direction": "desc" }],
  "page": 1,
  "limit": 10
}
```

`direction` is `"asc" | "desc" | null`.

### Response envelope for paginated list endpoints

```json
{
  "data": [
    /* array of T */
  ],
  "pagination": {
    "total_page": 10,
    "total_count": 100
  }
}
```

### Error response (any endpoint)

```json
{
  "code": "01004",
  "message": "Session expired"
}
```

Frontend auto-logs out on HTTP 401 with `code === "01004"`.

---

## Auth

### `POST /auth/login` _(public)_

Request:

```json
{
  "username": "admin",
  "password": "password123",
  "remember_me": true
}
```

Response:

```json
{
  "user_id": 1,
  "name": "Admin User",
  "username": "admin",
  "role": {
    "role_id": "8ab80f1c-054c-4184-a5d2-c50857dceab0",
    "name": "Viewer"
  },
  "access_token": "eyJhbGciOi...",
  "access_token_exp": 1745900000,
  "refresh_token": "eyJhbGciOi...",
  "refresh_token_exp": 1746500000,
  "remember_me": true
}
```

### `POST /auth/refresh-token` _(public)_

Request:

```json
{
  "access_token": "eyJhbGciOi...",
  "refresh_token": "eyJhbGciOi..."
}
```

Response:

```json
{
  "access_token": "eyJhbGciOi...",
  "access_token_exp": 1745900000,
  "refresh_token": "eyJhbGciOi...",
  "refresh_token_exp": 1746500000,
  "user_id": "1"
}
```

---

## Category

### `GET /category/list`

Request (query params serialized from body shape):

```json
{
  "criteria": { "search": "beverages" },
  "sort_bys": [{ "field": "name", "direction": "asc" }],
  "page": 1,
  "limit": 10
}
```

Response:

```json
{
  "data": [
    {
      "category_id": "CAT-BEV",
      "name": "Beverages",
      "description": "Drinks and juices",
      "created_at": "2026-01-10T09:00:00Z",
      "updated_at": "2026-04-01T10:15:00Z"
    }
  ],
  "pagination": { "total_page": 1, "total_count": 1 }
}
```

### `GET /category/:categoryId`

Response:

```json
{
  "category_id": "CAT-BEV",
  "name": "Beverages",
  "description": "Drinks and juices",
  "created_at": "2026-01-10T09:00:00Z",
  "updated_at": "2026-04-01T10:15:00Z"
}
```

### `POST /category`

Create (no `category_id`) / Update (with `category_id`):

```json
{
  "category_id": "CAT-BEV",
  "name": "Beverages",
  "description": "Drinks and juices"
}
```

Response: full `CategoryList` object (same shape as GET above).

### `DELETE /category/:categoryId`

Response: `204 No Content` or `{ "ok": true }`.

### `GET /category/dropdown`

Response:

```json
[
  { "category_id": "CAT-BEV", "name": "Beverages" },
  { "category_id": "CAT-SNK", "name": "Snacks" }
]
```

---

## Product

### `GET /product`

Request:

```json
{
  "criteria": { "search": "cola" },
  "sort_bys": [{ "field": "name", "direction": "asc" }],
  "page": 1,
  "limit": 10
}
```

Response:

```json
{
  "data": [
    {
      "product_id": "P001",
      "sku": "SKU-0001",
      "name": "Coca-Cola 325ml",
      "category_id": "CAT-BEV",
      "cost_price": 8,
      "selling_price": 15,
      "unit": "can",
      "min_stock": 24,
      "current_stock": 45,
      "created_at": "2026-01-10T09:00:00Z",
      "updated_at": "2026-04-01T10:15:00Z"
    }
  ],
  "pagination": { "total_page": 1, "total_count": 1 }
}
```

### `GET /product/:productId`

Response: single `ProductList` object.

### `POST /product`

Create (no `product_id`) / Update (with `product_id`):

```json
{
  "product_id": "P001",
  "name": "Coca-Cola 325ml",
  "sku": "SKU-0001",
  "category_id": "CAT-BEV",
  "cost_price": 8,
  "selling_price": 15,
  "unit": "can",
  "min_stock": 24
}
```

Response: full `ProductList` object.

### `DELETE /product/:productId`

Response: `204 No Content`.

### `GET /product/dropdown`

Response:

```json
[
  { "product_id": "P001", "sku": "SKU-0001", "name": "Coca-Cola 325ml" },
  { "product_id": "P002", "sku": "SKU-0002", "name": "Lay's Classic 50g" }
]
```

---

## Stock

### `GET /stock/list`

Request:

```json
{
  "criteria": {
    "search": "cola",
    "product_id": "P001",
    "type": "IN",
    "start_date": "2026-04-01",
    "end_date": "2026-04-23"
  },
  "sort_bys": [{ "field": "created_at", "direction": "desc" }],
  "page": 1,
  "limit": 10
}
```

`type` is `"IN" | "OUT" | "ADJUST"`.

Response:

```json
{
  "data": [
    {
      "transaction_id": "TX-001",
      "product_id": "P001",
      "product_name": "Coca-Cola 325ml",
      "type": "IN",
      "quantity": 100,
      "balance_after": 100,
      "note": "Initial stock import",
      "reason": null,
      "created_at": "2026-04-20T09:00:00Z",
      "created_by_name": "Admin User"
    }
  ],
  "pagination": { "total_page": 1, "total_count": 1 }
}
```

`reason` is only required for `type === "ADJUST"`.

### `POST /stock/in`

```json
{
  "product_id": "P001",
  "type": "IN",
  "quantity": 100,
  "note": "Received from supplier"
}
```

Response: `StockTransaction` (shape above).

### `POST /stock/out`

```json
{
  "product_id": "P001",
  "type": "OUT",
  "quantity": 10,
  "note": "Daily sales"
}
```

Response: `StockTransaction`.

### `POST /stock/adjust`

```json
{
  "product_id": "P001",
  "type": "ADJUST",
  "quantity": 110,
  "reason": "Monthly inventory count adjustment"
}
```

Response: `StockTransaction`.

### `GET /products/:productId/stock-summary`

Response:

```json
{
  "product_id": "P001",
  "current_stock": 45,
  "min_stock": 24,
  "is_low_stock": false
}
```

---

## Supplier

### `GET /supplier/list`

Request:

```json
{
  "criteria": { "search": "global" },
  "sort_bys": [{ "field": "name", "direction": "asc" }],
  "page": 1,
  "limit": 10
}
```

Response:

```json
{
  "data": [
    {
      "supplier_id": "SUP-001",
      "name": "Global Foods Co., Ltd.",
      "phone": "02-123-4567",
      "email": "contact@globalfoods.co.th",
      "address": "123 Industrial Rd, Bangkok",
      "created_at": "2026-01-10T09:00:00Z",
      "updated_at": "2026-04-01T10:15:00Z"
    }
  ],
  "pagination": { "total_page": 1, "total_count": 1 }
}
```

### `GET /supplier/:supplierId`

Response: single `SupplierList`.

### `POST /supplier`

Create / Update:

```json
{
  "supplier_id": "SUP-001",
  "name": "Global Foods Co., Ltd.",
  "phone": "02-123-4567",
  "email": "contact@globalfoods.co.th",
  "address": "123 Industrial Rd, Bangkok"
}
```

Response: full `SupplierList`.

### `DELETE /supplier/:supplierId`

Response: `204 No Content`.

### `GET /supplier/dropdown`

Response:

```json
[
  { "supplier_id": "SUP-001", "name": "Global Foods Co., Ltd." },
  { "supplier_id": "SUP-002", "name": "Bangkok Beverage Distributor" }
]
```

---

## Purchase Order

### `GET /purchase-orders`

Request:

```json
{
  "criteria": {
    "search": "PO-2026",
    "status": "RECEIVED",
    "supplier_id": "SUP-001"
  },
  "sort_bys": [{ "field": "created_at", "direction": "desc" }],
  "page": 1,
  "limit": 10
}
```

`status` is `"DRAFT" | "CONFIRMED" | "RECEIVED" | "CANCELLED"`.

Response:

```json
{
  "data": [
    {
      "purchase_order_id": "PO-2026-001",
      "supplier_name": "Global Foods Co., Ltd.",
      "status": "RECEIVED",
      "total_amount": 15000,
      "item_count": 2,
      "created_at": "2026-04-20T10:00:00Z",
      "created_by_name": "Admin User"
    }
  ],
  "pagination": { "total_page": 1, "total_count": 1 }
}
```

### `GET /purchase-orders/:id`

Response:

```json
{
  "purchase_order_id": "PO-2026-001",
  "supplier_id": "SUP-001",
  "supplier_name": "Global Foods Co., Ltd.",
  "status": "RECEIVED",
  "total_amount": 15000,
  "created_at": "2026-04-20T10:00:00Z",
  "created_by": "U001",
  "created_by_name": "Admin User",
  "items": [
    {
      "purchase_order_item_id": "POI-001",
      "purchase_order_id": "PO-2026-001",
      "product_id": "P001",
      "product_name": "Coca-Cola 325ml",
      "quantity": 500,
      "unit_price": 15,
      "subtotal": 7500
    }
  ]
}
```

### `POST /purchase-orders`

```json
{
  "order_number": "PO-2026-001",
  "supplier_id": "SUP-001",
  "total_amount": 15000,
  "items": [
    { "product_id": "P001", "quantity": 500, "unit_price": 15 },
    { "product_id": "P002", "quantity": 250, "unit_price": 30 }
  ],
  "created_by": "U001"
}
```

Response:

```json
{ "purchase_order_id": "PO-2026-001" }
```

### `PATCH /purchase-orders/:id/status`

```json
{
  "status": "CONFIRMED",
  "updated_by": "U001"
}
```

Allowed values: `DRAFT`, `CONFIRMED`, `RECEIVED`, `CANCELLED`. Transitioning to `RECEIVED` is expected to trigger stock-in on each PO item server-side.

Response: `204 No Content` or updated PO object.

---

## Dashboard

### `GET /dashboard/stats`

Response:

```json
{
  "summary": {
    "total_products": 42,
    "total_stock_value": 125000,
    "total_selling_value": 210000,
    "low_stock_count": 5,
    "pending_po_count": 3,
    "received_po_this_month": 8
  },
  "stock_movement": [
    { "date": "2026-04-20", "in": 100, "out": 10, "adjust": 0 },
    { "date": "2026-04-21", "in": 50, "out": 20, "adjust": 5 }
  ],
  "purchase_trend": [
    { "month": "2025-11", "total_amount": 50000, "order_count": 3 },
    { "month": "2025-12", "total_amount": 72000, "order_count": 5 }
  ],
  "low_stock_products": [
    {
      "product_id": "P002",
      "sku": "SKU-0002",
      "name": "Lay's Classic 50g",
      "current_stock": 5,
      "min_stock": 30,
      "unit": "pack"
    }
  ]
}
```

---

## Reports

### `GET /reports/stock-summary`

Response:

```json
{
  "rows": [
    {
      "product_id": "P001",
      "sku": "SKU-0001",
      "name": "Coca-Cola 325ml",
      "unit": "can",
      "current_stock": 45,
      "min_stock": 24,
      "cost_price": 8,
      "selling_price": 15,
      "cost_value": 360,
      "selling_value": 675,
      "is_low_stock": false
    }
  ],
  "totals": {
    "total_products": 42,
    "total_cost_value": 125000,
    "total_selling_value": 210000,
    "low_stock_count": 5
  }
}
```

### `GET /reports/stock-movements?from=YYYY-MM-DD&to=YYYY-MM-DD`

Response:

```json
{
  "rows": [
    {
      "transaction_id": "TX-001",
      "product_id": "P001",
      "product_name": "Coca-Cola 325ml",
      "type": "IN",
      "quantity": 100,
      "balance_after": 100,
      "note": "Initial stock import",
      "reason": null,
      "created_at": "2026-04-20T09:00:00Z",
      "created_by_name": "Admin User"
    }
  ],
  "daily": [{ "date": "2026-04-20", "in": 100, "out": 0, "adjust": 0 }],
  "totals": {
    "total_in": 150,
    "total_out": 30,
    "total_adjust": 5
  }
}
```

### `GET /reports/purchase-summary?month=YYYY-MM`

Response:

```json
{
  "month": "2026-04",
  "rows": [
    {
      "purchase_order_id": "PO-2026-001",
      "supplier_name": "Global Foods Co., Ltd.",
      "status": "RECEIVED",
      "item_count": 2,
      "total_amount": 15000,
      "created_at": "2026-04-20T10:00:00Z",
      "created_by_name": "Admin User"
    }
  ],
  "totals": {
    "total_orders": 3,
    "total_amount": 32000,
    "by_status": {
      "DRAFT": 1,
      "CONFIRMED": 1,
      "RECEIVED": 1,
      "CANCELLED": 0
    }
  }
}
```

### `GET /reports/stock-summary/export?format=csv`

Response: binary blob.
Headers:

- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename="stock-summary-YYYY-MM-DD.csv"`

### `GET /reports/stock-movements/export?format=xlsx&from=YYYY-MM-DD&to=YYYY-MM-DD`

Response: binary blob.
Headers:

- `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename="stock-movement-<from>-to-<to>.xlsx"`

### `GET /reports/purchase-summary/export?format=xlsx&month=YYYY-MM`

Response: binary blob.
Headers:

- `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename="purchase-summary-YYYY-MM.xlsx"`

---

## Enums

```ts
type PurchaseOrderStatus = "DRAFT" | "CONFIRMED" | "RECEIVED" | "CANCELLED";
type TransactionType = "IN" | "OUT" | "ADJUST";
type OrderBy = "asc" | "desc" | null;
```
