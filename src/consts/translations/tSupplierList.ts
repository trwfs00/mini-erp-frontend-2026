export const tSupplierList = {
  title: { th: "ผู้จัดจำหน่าย", en: "Suppliers" },
  subTitle: { th: "ผู้จัดจำหน่ายทั้งหมด", en: "All Suppliers" },
  supplier: { th: "ผู้จัดจำหน่าย", en: "supplier" },

  thead: {
    info: { th: "ข้อมูลผู้จัดจำหน่าย", en: "Supplier Information" },
    contact: { th: "ติดต่อ", en: "Contact" },
    address: { th: "ที่อยู่", en: "Address" },
    updated: { th: "แก้ไขล่าสุด", en: "Updated" },
    actions: { th: "จัดการ", en: "Actions" },
  },

  searchPlaceholder: {
    th: "ค้นหาชื่อ อีเมล หรือเบอร์โทร...",
    en: "Search by name, email or phone...",
  },

  // Form
  form: {
    addTitle: { th: "เพิ่มผู้จัดจำหน่าย", en: "Add New Supplier" },
    editTitle: { th: "แก้ไขผู้จัดจำหน่าย", en: "Edit Supplier" },
    nameLabel: { th: "ชื่อผู้จัดจำหน่าย", en: "Supplier Name" },
    namePlaceholder: {
      th: "เช่น บริษัท โกลบอล ฟู้ดส์ จำกัด",
      en: "e.g. Global Foods Co., Ltd.",
    },
    phoneLabel: { th: "เบอร์โทรศัพท์", en: "Phone Number" },
    phonePlaceholder: { th: "เช่น 02-123-4567", en: "e.g. 02-123-4567" },
    emailLabel: { th: "อีเมล", en: "Email Address" },
    emailPlaceholder: {
      th: "เช่น contact@supplier.com",
      en: "e.g. contact@supplier.com",
    },
    addressLabel: { th: "ที่อยู่", en: "Address" },
    addressPlaceholder: {
      th: "ที่อยู่ของกิจการแบบเต็ม",
      en: "Full business address",
    },
    submitCreate: { th: "สร้างผู้จัดจำหน่าย", en: "Create Supplier" },
    submitEdit: { th: "บันทึกการแก้ไข", en: "Save Changes" },
  },

  description: {
    th: "จัดการความสัมพันธ์กับผู้จัดจำหน่าย",
    en: "Manage your supplier relationships.",
  },
} as const;
