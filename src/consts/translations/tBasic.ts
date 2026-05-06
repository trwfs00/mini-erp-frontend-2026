export const tBasic = {
  // form / validation
  form: {
    validateRequired: {
      th: "โปรดกรอกข้อมูลให้ครบถ้วน",
      en: "Please fill in all required fields",
    },
    validateInvalidEmail: {
      th: "รูปแบบอีเมลไม่ถูกต้อง",
      en: "Invalid email format",
    },
    validateInvalidPhone: {
      th: "รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง",
      en: "Invalid phone number format",
    },
    validateMinLength: (min: number) => ({
      th: `กรุณากรอกอย่างน้อย ${min} ตัวอักษร`,
      en: `Please enter at least ${min} characters`,
    }),
    validateMaxLength: (max: number) => ({
      th: `กรุณากรอกไม่เกิน ${max} ตัวอักษร`,
      en: `Please enter no more than ${max} characters`,
    }),
    validateMinNumber: (min: number) => ({
      th: `กรุณากรอกตัวเลขตั้งแต่ ${min} ขึ้นไป`,
      en: `Please enter a number from ${min} or more`,
    }),
    inputPlaceholder: { th: "ระบุ", en: "Specify" },
    selectPlaceholder: { th: "เลือก", en: "Select" },
  },

  // CRUD / actions
  textSearch: { th: "ค้นหา", en: "Search" },
  textFilter: { th: "ตัวกรอง", en: "Filter" },
  textRefresh: { th: "รีเฟรช", en: "Refresh" },
  textRefreshData: { th: "รีเฟรชข้อมูล", en: "Refresh Data" },
  textApply: { th: "นำไปใช้", en: "Apply" },
  textReset: { th: "ล้างค่า", en: "Reset" },
  textConfirm: { th: "ยืนยัน", en: "Confirm" },
  textCancel: { th: "ยกเลิก", en: "Cancel" },
  textClose: { th: "ปิด", en: "Close" },
  textSave: { th: "บันทึก", en: "Save" },
  textCreate: { th: "สร้าง", en: "Create" },
  textAdd: { th: "เพิ่ม", en: "Add" },
  textAddNew: { th: "เพิ่มข้อมูล", en: "Add New" },
  textEdit: { th: "แก้ไข", en: "Edit" },
  textDelete: { th: "ลบ", en: "Delete" },
  textView: { th: "ดู", en: "View" },
  textBack: { th: "ย้อนกลับ", en: "Back" },
  textNext: { th: "ถัดไป", en: "Next" },
  textPrevious: { th: "ก่อนหน้า", en: "Previous" },
  textExport: { th: "ส่งออก", en: "Export" },
  textDownload: { th: "ดาวน์โหลด", en: "Download" },

  // status / empty states
  textStatus: { th: "สถานะ", en: "Status" },
  textActive: { th: "เปิดการใช้งาน", en: "Active" },
  textInactive: { th: "ปิดการใช้งาน", en: "Inactive" },
  textNoData: { th: "ไม่มีข้อมูล", en: "No data" },
  textNoDataFound: { th: "ไม่พบข้อมูล", en: "No data found" },
  textNoRecordFound: (recordName: string) => ({
    th: `ไม่พบข้อมูล${recordName}`,
    en: `No ${recordName} record found`,
  }),
  textDetailNoRecordFound: (recordName: string) => ({
    th: `คลิก "เพิ่มใหม่" เพื่อสร้าง${recordName}ใหม่`,
    en: `Click "Add New" to create a new ${recordName}.`,
  }),
  textAll: { th: "ทั้งหมด", en: "All" },
  textYes: { th: "ใช่", en: "Yes" },
  textNo: { th: "ไม่", en: "No" },

  // user / auth
  textUsername: { th: "ชื่อบัญชีผู้ใช้งาน", en: "Username" },
  textPassword: { th: "รหัสผ่าน", en: "Password" },
  textEmail: { th: "อีเมล", en: "Email" },
  textLogin: { th: "เข้าสู่ระบบ", en: "Login" },
  textLogout: { th: "ออกจากระบบ", en: "Logout" },

  // pagination
  pagination: {
    rowsPerPage: { th: "แสดงต่อหน้า", en: "Rows per page" },
    showLimit: { th: "แสดง", en: "Show" },
    fromTo: (from: number, to: number, total: number) => ({
      th: `${from}-${to} จาก ${total.toLocaleString()} รายการ`,
      en: `${from}-${to} of ${total.toLocaleString()}`,
    }),
  },

  // notifications
  notifyCreateSuccess: (msg: string) => ({
    th: `เพิ่มข้อมูล${msg}สำเร็จ`,
    en: `${msg} created successfully`,
  }),
  notifyUpdateSuccess: (msg: string) => ({
    th: `แก้ไขข้อมูล${msg}สำเร็จ`,
    en: `${msg} updated successfully`,
  }),
  notifyDeleteSuccess: (msg: string) => ({
    th: `ลบข้อมูล${msg}สำเร็จ`,
    en: `${msg} deleted successfully`,
  }),
  notifyCreateError: (msg: string) => ({
    th: `เพิ่มข้อมูล${msg}ไม่สำเร็จ`,
    en: `Failed to create ${msg}`,
  }),
  notifyUpdateError: (msg: string) => ({
    th: `แก้ไขข้อมูล${msg}ไม่สำเร็จ`,
    en: `Failed to update ${msg}`,
  }),
  notifyDeleteError: (msg: string) => ({
    th: `ลบข้อมูล${msg}ไม่สำเร็จ`,
    en: `Failed to delete ${msg}`,
  }),

  // confirm modals
  confirmModalDelete: (msg: string) => ({
    title: {
      th: `ยืนยันการลบข้อมูล${msg}`,
      en: `Confirm Delete ${msg}`,
    },
    message: {
      th: `คุณต้องการลบข้อมูล${msg}หรือไม่? การกระทำนี้ไม่สามารถยกเลิกได้`,
      en: `Are you sure you want to delete this ${msg}? This action cannot be undone.`,
    },
  }),
} as const;
