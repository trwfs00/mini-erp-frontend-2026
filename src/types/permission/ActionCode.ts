import { actionCodes } from "@/consts/permission/actionCodes";

export type ActionCode = (typeof actionCodes)[keyof typeof actionCodes];
