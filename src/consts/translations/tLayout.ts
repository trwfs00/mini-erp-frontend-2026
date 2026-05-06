export const tLayout = {
  header: {
    toggleSidebarMobile: {
      th: "สลับเมนู (มือถือ)",
      en: "Toggle sidebar (mobile)",
    },
    mockBadge: { th: "โหมดข้อมูลจำลอง", en: "MOCK DATA MODE" },
    mockTooltip: {
      th: "กำลังใช้ข้อมูลจำลอง — ไม่ได้เชื่อมต่อ backend",
      en: "Using mock data — backend not connected",
    },
    authBypassBadge: { th: "โหมดข้ามการ Login", en: "AUTH BYPASS MODE" },
    authBypassTooltip: {
      th: "โหมดข้ามการ login — ใช้ข้อมูลที่บันทึกไว้",
      en: "Auth Bypass mode — using stored credentials",
    },
  },
  sidebar: {
    toggle: { th: "สลับเมนู", en: "Toggle sidebar" },
    close: { th: "ปิดเมนู", en: "Close sidebar" },
    brand: { th: "Mini ERP", en: "Mini ERP" },
  },
} as const;
