import { publicApiRoutes } from "@/consts/api/public-api-routes";
import { $authUser } from "@/stores/auth-user-store";
import { $has401Error } from "@/stores/has-401-error-store";
import {
  $refreshTokenPromise,
  type AuthTokens,
} from "@/stores/refresh-token-promise-store";
import type { User } from "@/types/auth/user";
import axios, {
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from "axios";
import { AuthUtil } from "./auth-util";
import { LocalStorageUtil } from "./local-storage-util";
import { TokenTimerUtil } from "./token-timer-util";
import type { ApiReturn } from "@/types/api/api-return";

const baseAxios = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
});

const createRequest = async <T>(
  config: AxiosRequestConfig,
): Promise<ApiReturn<T>> => {
  try {
    const response = await baseAxios.request<T>(config);
    return { ok: true, data: response.data };
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const data = error.response?.data as
        | { code?: string; message?: string }
        | undefined;
      return {
        ok: false,
        code: data?.code,
        message: data?.message ?? error.message,
      };
    }
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Unexpected error",
    };
  }
};

const tokenLoginInterceptFn = async (config: InternalAxiosRequestConfig) => {
  //get request url (after baseUrl) without query string
  const requestUrl = config.url?.split("?")[0];
  //by pass public api routes
  if (publicApiRoutes.includes(requestUrl as string)) return config;

  let authUser = $authUser.get();
  if (!authUser) return config;

  //access token expired, try to refresh it first
  if (authUser.access_token_exp < Date.now() / 1000) {
    try {
      let refreshTokenPromise = $refreshTokenPromise.get();

      if (!refreshTokenPromise) {
        refreshTokenPromise = axios
          .post<AuthTokens>(
            `${import.meta.env.VITE_APP_BASE_API_URL}/auth/refresh-token`,
            {
              access_token: authUser.access_token,
              refresh_token: authUser.refresh_token,
            },
          )
          .then((response) => response.data)
          .finally(() => {
            $refreshTokenPromise.set(null);
          });
        $refreshTokenPromise.set(refreshTokenPromise);
      }

      const response = await refreshTokenPromise;

      //success, update access & refresh token
      $authUser.set({
        ...authUser,
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        access_token_exp: response.access_token_exp,
        refresh_token_exp: response.refresh_token_exp,
      });
      LocalStorageUtil.saveAuthUser($authUser.get() as User);
    } catch {
      $refreshTokenPromise.set(null);
      //cancel request
      const controller = new AbortController();
      controller.abort();

      //notify error & go to login page
      AuthUtil.logout();

      //also abort the request
      return {
        ...config,
        signal: controller.signal,
      };
    }

    //refresh token ok
    //has to re-get because store is updated in after refreshing token
    authUser = $authUser.get() as User; //cast as AuthUser because we know it will not be null
    //reset token timer
    TokenTimerUtil.startTimer(
      authUser.access_token_exp,
      authUser.refresh_token_exp,
    );
  }
  config.headers.Authorization = `Bearer ${authUser.access_token}`;
  return config;
};

//required login on golang back office API
baseAxios.interceptors.request.use(tokenLoginInterceptFn);

// Response interceptor to handle 401 Unauthorized errors
baseAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if error is 401 Unauthorized
    if (error.response?.status === 401) {
      // Get error code from backend response
      const errorCode = error.response?.data?.code as string;

      // Only auto-logout and show notification for session expired (01004)
      // Not for login failures (02002) or other 401 errors
      if (errorCode === "01004") {
        // Show notification only once, even if multiple APIs return 401
        // CRITICAL: Set flag FIRST to prevent race condition
        const hasAlreadyShownError = $has401Error.get();
        $has401Error.set(true);

        if (!hasAlreadyShownError) {
          // Show notification immediately
          AuthUtil.logout();
        }
      }
    }
    return Promise.reject(error);
  },
);

export const AxiosUtil = {
  createRequest,
};
