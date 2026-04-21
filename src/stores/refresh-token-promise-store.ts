import { atom } from "nanostores";

export type AuthTokens = {
  access_token: string;
  access_token_exp: number;
  refresh_token: string;
  refresh_token_exp: number;
};

export const $refreshTokenPromise = atom<Promise<AuthTokens> | null>(null);
