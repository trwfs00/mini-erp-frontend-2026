import type { User } from "@/types/auth/user";
import { atom } from "nanostores";

export const $authUser = atom<User | null>(null);
