import type { User } from "@/types/auth/User";

export type LoginResponse = User;

export type RefreshTokenResponse = {
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  refresh_token_exp: number;
  user_id: string;
};
