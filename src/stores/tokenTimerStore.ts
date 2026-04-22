import { atom } from "nanostores";

type TokenTimer = {
  intervalId: number;
  tokenTimeLeft: number;
  refreshTokenTimeLeft: number;
  tokenExpireAt: number;
  refreshTokenExpireAt: number;
} | null;

export const $tokenTimer = atom<TokenTimer>(null);
