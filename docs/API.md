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
    "name": "Admin"
  },
  "menu_permissions": [
    {
      "menu_id": 1,
      "code": "dashboard",
      "name": "Dashboard",
      "seq": 1,
      "permissions": [
        { "permission_id": 1, "code": "view",   "is_allowed": true,  "seq": 1 },
        { "permission_id": 2, "code": "create", "is_allowed": false, "seq": 2 },
        { "permission_id": 3, "code": "update", "is_allowed": false, "seq": 3 },
        { "permission_id": 4, "code": "delete", "is_allowed": false, "seq": 4 },
        { "permission_id": 5, "code": "import", "is_allowed": false, "seq": 5 },
        { "permission_id": 6, "code": "export", "is_allowed": false, "seq": 6 }
      ]
    },
    {
      "menu_id": 6,
      "code": "purchase_order",
      "name": "Purchase Order",
      "seq": 6,
      "permissions": [
        { "permission_id": 1, "code": "view",   "is_allowed": true, "seq": 1 },
        { "permission_id": 2, "code": "create", "is_allowed": true, "seq": 2 },
        { "permission_id": 3, "code": "update", "is_allowed": true, "seq": 3 },
        { "permission_id": 4, "code": "delete", "is_allowed": true, "seq": 4 },
        { "permission_id": 5, "code": "import", "is_allowed": false, "seq": 5 },
        { "permission_id": 6, "code": "export", "is_allowed": true, "seq": 6 }
      ]
    }
  ],
  "access_token": "eyJhbGciOi...",
  "access_token_exp": 1745900000,
  "refresh_token": "eyJhbGciOi...",
  "refresh_token_exp": 1746500000,
  "remember_me": true
}
```

Notes:
- `menu_permissions` ส่งทุก menu ที่ user ของ role นี้รู้จัก พร้อมทุก action (view/create/update/delete/import/export) — ค่าที่ไม่ได้รับสิทธิ์ใส่ `is_allowed: false`
- `code` ใน `menu_permissions[].code` ใช้ค่าจาก `PermissionCode` enum (ดูท้ายไฟล์)
- `code` ใน `permissions[].code` ใช้ค่าจาก `ActionCode` enum (ดูท้ายไฟล์)
- frontend ใช้ field นี้กับ `<RoleGuard>` ที่ระดับ route และ `usePermission()` ที่ระดับปุ่ม

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
  "user_id": "1",
  "menu_permissions": [
    /* same shape as /auth/login — optional */
  ]
}
```

Notes:
- `menu_permissions` เป็น **optional** — ถ้า backend ส่งกลับมา frontend จะ sync ทันที (รองรับ admin แก้สิทธิ์ระหว่าง session); ถ้าไม่ส่ง frontend จะคง permissions เดิมไว้

---

### `menu_permissions` — โครงสร้างและการใช้งาน

Field `menu_permissions` ที่ส่งกลับใน `/auth/login` (และ optionally `/auth/refresh-token`) คือ **matrix ของสิทธิ์** ที่บอกว่า user ทำอะไรได้บ้างใน app — Frontend ใช้ field นี้เป็น single source of truth สำหรับการเช็คสิทธิ์ทุกที่

#### โครงสร้าง 2 ชั้น

```
menu_permissions[]              ← outer: menu (หน้า / domain)
  └─ permissions[]              ← inner: action (สิ่งที่ทำได้ในหน้านั้น)
```

| ชั้น | หมายถึง | ตัวอย่าง `code` |
|---|---|---|
| outer (menu) | "หน้า" / "domain" / "module" | `"product"`, `"stock"`, `"report"` |
| inner (permission) | "การกระทำ" ในหน้านั้น | `"view"`, `"create"`, `"delete"` |

#### Field ในแต่ละ menu

| field | type | หน้าที่ |
|---|---|---|
| `menu_id` | number | PK ของ menu ใน DB (อ้างอิงเฉยๆ, FE ไม่ได้ใช้เช็ค) |
| `code` | `PermissionCode` | identifier ที่ FE ใช้เช็คสิทธิ์ — ตรงกับค่าใน `permissionCodes` |
| `name` | string | ชื่อแสดง UI (sidebar, breadcrumb) |
| `seq` | number | ลำดับการแสดง (ใช้ sort sidebar) |
| `permissions` | `Permission[]` | list ของ action ในเมนูนี้ |

#### Field ในแต่ละ permission (action)

| field | type | หน้าที่ |
|---|---|---|
| `permission_id` | number | PK ของ row ใน DB |
| `code` | `ActionCode` | identifier ที่ FE ใช้เช็ค (`view`/`create`/...) |
| `is_allowed` | boolean | **flag หลัก** — true = user role นี้ทำ action นี้ได้ |
| `seq` | number | ลำดับการแสดงในหน้า admin role-permission |

#### กฎสำคัญ

1. **ส่งครบทุก action ในทุก menu** — ทั้งที่ allowed และไม่ allowed
   - ทำให้หน้า admin จัดการ role render checkbox ได้ครบ
   - FE เช็ค `is_allowed` ตรงๆ ไม่ต้อง assume "ไม่มี = ห้าม"
2. **ส่งครบทุก menu ที่ระบบรู้จัก** — แม้ user role นี้ไม่มีสิทธิ์ใดเลยก็ส่ง (ทุก action `is_allowed: false`)
3. **`code` ต้องตรงกับ enum FE** — `PermissionCode` และ `ActionCode` ใน frontend คือ contract; ถ้า backend ส่ง code ที่ไม่ match → FE จะมองว่าไม่มีสิทธิ์

#### ตัวอย่าง: Staff role ใน menu `product`

```json
{
  "menu_id": 3,
  "code": "product",
  "name": "Product",
  "seq": 3,
  "permissions": [
    { "permission_id": 1, "code": "view",   "is_allowed": true,  "seq": 1 },
    { "permission_id": 2, "code": "create", "is_allowed": false, "seq": 2 },
    { "permission_id": 3, "code": "update", "is_allowed": true,  "seq": 3 },
    { "permission_id": 4, "code": "delete", "is_allowed": false, "seq": 4 },
    { "permission_id": 5, "code": "import", "is_allowed": false, "seq": 5 },
    { "permission_id": 6, "code": "export", "is_allowed": false, "seq": 6 }
  ]
}
```

→ Staff ดู product ได้ + แก้ได้ แต่สร้าง/ลบ/import/export ไม่ได้

#### Frontend ใช้ field นี้ที่ไหน

| ที่ | หน้าที่ | ตัวอย่าง |
|---|---|---|
| `<RoleGuard>` (route-level) | block ไม่ให้เข้าหน้าถ้าไม่มีสิทธิ์ → redirect | `<RoleGuard mode="single" permissionCode="product">` |
| `usePermission()` (UI-level) | ซ่อน/disable ปุ่ม Create/Update/Delete | `const { canCreate } = usePermission("product")` |
| Sidebar filter (ยังไม่ implement) | โชว์เฉพาะ menu ที่มีสิทธิ์ | `menu_permissions.filter(m => m.permissions.some(p => p.is_allowed))` |

#### เมื่อไหร่ data จะ update

- **Login** → โหลดใหม่ทั้งก้อน
- **Refresh-token** → optional; ถ้า backend ส่ง `menu_permissions` กลับมา FE จะ sync (รองรับ admin แก้สิทธิ์ระหว่าง user online); ถ้าไม่ส่ง → ใช้ของเดิม
- **Admin แก้สิทธิ์** → user ต้อง refresh token หรือ re-login ถึงจะเห็นการเปลี่ยน

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

type PermissionCode =
  | "dashboard"
  | "category"
  | "product"
  | "stock"
  | "supplier"
  | "purchase_order"
  | "report";

type ActionCode =
  | "view"
  | "create"
  | "update"
  | "delete"
  | "import"
  | "export";
```

---

## Roles & Permission Matrix (default seed)

| menu | Admin | Staff | Viewer |
|---|---|---|---|
| `dashboard` | view | view | view |
| `category` | view, create, update, delete | view | view |
| `product` | view, create, update, delete | view, update | view |
| `stock` | view, create, update, delete, import, export | view, create | view |
| `supplier` | view, create, update, delete | view | view |
| `purchase_order` | view, create, update, delete, export | view, create, update | view |
| `report` | view, export | view, export | view |

Notes:
- Matrix นี้เป็นค่าเริ่มต้น — admin สามารถปรับสิทธิ์ต่อ role ผ่าน UI ได้ภายหลัง
- Action ที่ไม่อยู่ในตาราง = `is_allowed: false`
