export const tProductList = {
  title: { th: "สินค้า", en: "Products" },
  subTitle: { th: "สินค้าทั้งหมด", en: "All Products" },
  product: { th: "สินค้า", en: "product" },

  thead: {
    sku: { th: "SKU", en: "SKU" },
    name: { th: "ชื่อสินค้า", en: "Product Name" },
    category: { th: "หมวดหมู่", en: "Category" },
    cost: { th: "ต้นทุน", en: "Cost" },
    price: { th: "ราคา", en: "Price" },
    unit: { th: "หน่วย", en: "Unit" },
    stock: { th: "คงเหลือ", en: "Stock" },
    minStock: { th: "ขั้นต่ำ", en: "Min Stock" },
    updated: { th: "แก้ไขล่าสุด", en: "Updated" },
    actions: { th: "จัดการ", en: "Actions" },
  },

  searchPlaceholder: {
    th: "ค้นหาชื่อหรือ SKU...",
    en: "Search by name or sku...",
  },

  // Form
  form: {
    addTitle: { th: "เพิ่มสินค้า", en: "Add New Product" },
    editTitle: { th: "แก้ไขสินค้า", en: "Edit Product" },
    skuLabel: { th: "SKU", en: "SKU" },
    skuPlaceholder: { th: "ระบุ SKU ของสินค้า", en: "Enter product SKU" },
    nameLabel: { th: "ชื่อสินค้า", en: "Product Name" },
    namePlaceholder: { th: "ระบุชื่อสินค้า", en: "Enter product name" },
    categoryLabel: { th: "หมวดหมู่", en: "Category" },
    categoryPlaceholder: { th: "เลือกหมวดหมู่", en: "Select a category" },
    costLabel: { th: "ราคาต้นทุน", en: "Cost Price" },
    sellingLabel: { th: "ราคาขาย", en: "Selling Price" },
    unitLabel: { th: "หน่วย", en: "Unit" },
    unitPlaceholder: { th: "เช่น ชิ้น, กล่อง", en: "e.g. piece, box" },
    minStockLabel: { th: "สต็อกขั้นต่ำ", en: "Min Stock" },
    submitCreate: { th: "สร้างสินค้า", en: "Create Product" },
    submitEdit: { th: "บันทึกการแก้ไข", en: "Save Changes" },
  },

  description: {
    th: "จัดการรายการสินค้าของคุณ",
    en: "Manage your product catalog.",
  },
} as const;
