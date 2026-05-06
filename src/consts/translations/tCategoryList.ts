export const tCategoryList = {
  title: { th: "หมวดหมู่", en: "Categories" },
  subTitle: { th: "หมวดหมู่ทั้งหมด", en: "All Categories" },
  category: { th: "หมวดหมู่", en: "category" },

  thead: {
    id: { th: "รหัส", en: "ID" },
    name: { th: "ชื่อหมวดหมู่", en: "Category Name" },
    description: { th: "คำอธิบาย", en: "Description" },
    updated: { th: "แก้ไขล่าสุด", en: "Updated" },
    actions: { th: "จัดการ", en: "Actions" },
  },

  // Search
  searchPlaceholder: {
    th: "ค้นหาชื่อหรือคำอธิบาย...",
    en: "Search by name or description...",
  },

  // Form
  form: {
    addTitle: { th: "เพิ่มหมวดหมู่", en: "Add New Category" },
    editTitle: { th: "แก้ไขหมวดหมู่", en: "Edit Category" },
    nameLabel: { th: "ชื่อหมวดหมู่", en: "Category Name" },
    namePlaceholder: { th: "เช่น เครื่องดื่ม, ขนม", en: "e.g. Beverages, Snacks" },
    descriptionLabel: { th: "คำอธิบาย", en: "Description" },
    descriptionPlaceholder: {
      th: "อธิบายว่าหมวดหมู่นี้มีสินค้าประเภทใด",
      en: "Describe what products belong to this category",
    },
    submitCreate: { th: "สร้างหมวดหมู่", en: "Create Category" },
    submitEdit: { th: "บันทึกการแก้ไข", en: "Save Changes" },
  },

  // Description text
  description: {
    th: "จัดระเบียบสินค้าเข้าหมวดหมู่ต่างๆ",
    en: "Organize products into categories.",
  },
} as const;
