import { LOCAL_STORAGE_KEYS } from "@/consts/keys/localStorageKeys";
import type { User } from "@/types/auth/User";
import CryptoJS from "crypto-js";

const CIPHER = `ng3BiXNDQAZ2xqG8SMyBiflaDzQ350sBgDPlRd/eOSQ="`;

export const LocalStorageUtil = {
  saveAuthUser(user: User) {
    const authUserString = JSON.stringify(user);
    const encrypted = CryptoJS.AES.encrypt(authUserString, CIPHER).toString();

    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTH_USER, encrypted);
  },
  loadAuthUser() {
    const authUserString = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_USER);
    if (!authUserString) return null;

    try {
      const bytes = CryptoJS.AES.decrypt(authUserString, CIPHER);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  },
  deleteAuthUser() {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.AUTH_USER);
  },
};
