import type { User } from "@/types/auth/User";
import { atom } from "nanostores";

export const $authUser = atom<User | null>(null);
