import { AxiosUtil } from "@/utils/AxiosUtil";

import type { LoginRequest, RefreshTokenRequest } from "./types/AuthRequest";
import type { LoginResponse, RefreshTokenResponse } from "./types/AuthResponse";
import type { ApiReturn } from "@/types/api/ApiReturn";

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
