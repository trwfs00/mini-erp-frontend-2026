// TODO: ลบไฟล์นี้เมื่อ integrate API จริง — ใช้ผ่าน enableAuthBypass(true) เท่านั้น
import type { User } from "@/types/auth/User";

export const BYPASS_ADMIN_USER: User = {
  user_id: "bypass-admin",
  username: "admin",
  role: { role_id: "admin", name: "Admin" },
  access_token: "",
  access_token_exp: 0,
  refresh_token: "",
  refresh_token_exp: 0,
  remember_me: false,
};
