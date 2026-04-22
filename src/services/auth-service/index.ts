import { AxiosUtil } from "@/utils/axios-util";

import type { LoginRequest, RefreshTokenRequest } from "./types/auth-request";
import type {
  LoginResponse,
  RefreshTokenResponse,
} from "./types/auth-response";
import type { ApiReturn } from "@/types/api/api-return";

export const AuthService = {
  async login(data: LoginRequest): Promise<ApiReturn<LoginResponse>> {
    return AxiosUtil.createRequest<LoginResponse>({
      method: "POST",
      url: "/auth/login",
      data,
    });
  },

  async refresh(
    data: RefreshTokenRequest,
  ): Promise<ApiReturn<RefreshTokenResponse>> {
    return AxiosUtil.createRequest<RefreshTokenResponse>({
      method: "POST",
      url: "/auth/refresh-token",
      data,
    });
  },
};
