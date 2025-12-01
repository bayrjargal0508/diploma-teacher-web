import {
  getRefreshToken,
  getToken,
  isTokenExpired,
  setRefreshToken,
  setToken,
} from "@/actions/cookies";
import { AUTH_API_URL } from "@/utils/urls";
import { User } from "@/lib/responses";

export interface FetchError extends Error {
  response?: Response;
  data?: unknown;
}

export type CustomResponse<T> = {
  result: boolean;
  data?: T;
  message?: string;
  code?: number;
};

export async function refreshToken(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${AUTH_API_URL}/api/v2/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        refreshToken: refresh,
      }),
    });

    if (!res.ok) return null;

    const data: User = await res.json();
    if (data?.token) {
      await setToken(data.token);
      await setRefreshToken(data.refreshToken);
      return data.token;
    }

    return null;
  } catch (err) {
    console.error("Failed to refresh token:", err);
    return null;
  }
}

export const fetchUtils = {
  get: async <T>(
    url: string,
    isTokenRequired?: boolean,
    options?: RequestInit
  ): Promise<CustomResponse<T>> => {
    let token = undefined;
    if (isTokenRequired) {
      token = await getToken();
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };
    return fetchUtils.request<T>(
      url,
      {
        ...options,
        method: "GET",
        headers,
      },
      token
    );
  },

  post: async <T>(
    url: string,
    data: unknown,
    isTokenRequired: boolean = true,
    options?: RequestInit
  ): Promise<CustomResponse<T>> => {
    let token = undefined;

    // get token if needed
    if (isTokenRequired) {
      token = await getToken();
      // console.log("url", url, token);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      // ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(token ? { "x-auth-token": token } : {}),
      ...options?.headers,
    };

    return fetchUtils.request<T>(url, {
      ...options,
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });
  },
  patch: async <T>(
    url: string,
    data: unknown,
    isTokenRequired?: boolean,
    options?: RequestInit
  ): Promise<CustomResponse<T>> => {
    let token = undefined;
    if (isTokenRequired) {
      token = await getToken();
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    return fetchUtils.request<T>(
      url,
      {
        ...options,
        method: "PATCH",
        headers,
        body: JSON.stringify(data),
      },
      token
    );
  },

  delete: async <T>(
    url: string,
    data: unknown,
    isTokenRequired?: boolean,
    options?: RequestInit
  ): Promise<CustomResponse<T>> => {
    let token = undefined;
    if (isTokenRequired) {
      token = await getToken();
    }
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    return fetchUtils.request<T>(
      url,
      {
        ...options,
        method: "DELETE",
        headers,
        body: JSON.stringify(data),
      },
      token
    );
  },

  request: async <T>(
    url: string,
    options: RequestInit,
    token?: string | undefined
  ): Promise<CustomResponse<T>> => {
    try {
      const headers: HeadersInit = {
        ...(token ? { "X-Auth-Token": token } : {}),
        ...options?.headers,
      };

      let response = await fetch(url, { ...options, headers });

      // 🔍 Handle expired token (401)
      if (response.status >= 400 && response.status < 500) {
        const tokenExpired = await isTokenExpired();
        if (tokenExpired) {
          console.log("TOKEN EXPIRED");
          const newToken = await refreshToken();
          if (newToken) {
            // retry original request
            const retryHeaders: HeadersInit = {
              ...headers,
              "X-Auth-Token": newToken,
            };
            response = await fetch(url, { ...options, headers: retryHeaders });
          }
        }
      }

      if (response.ok) {
        const data = response.headers
          .get("content-type")
          ?.includes("application/json")
          ? await response.json()
          : await response.text();

        return { result: true, data: data as T };
      } else {
        const errorData = await response.text();
        if (errorData.startsWith("{")) {
          const errorJson = JSON.parse(errorData);
          if (errorJson?.message) {
            return { result: false, message: errorJson.message };
          }
        }
        return { result: false, message: errorData };
      }
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  },
  put: async <T>(
    url: string,
    data: unknown,
    isTokenRequired: boolean = true,
    options?: RequestInit
  ): Promise<CustomResponse<T>> => {
    let token = undefined;

    // get token if needed
    if (isTokenRequired) {
      token = await getToken();
      // console.log("url", url, token);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      // ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(token ? { "x-auth-token": token } : {}),
      ...options?.headers,
    };

    return fetchUtils.request<T>(url, {
      ...options,
      method: "PUT",
      headers,
      body: JSON.stringify(data),
    });
  },
};
