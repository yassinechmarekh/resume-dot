import "server-only";

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { cookies } from "next/headers";
import { CookieKeys, HttpStatusCode } from "./constants";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  withCredentials: true,
  validateStatus: () => true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Automatically adds the token
api.interceptors.request.use(
  async (config) => {
    const cookieStore = await cookies();
    const token = cookieStore.get(CookieKeys.ACCESSTOKEN)?.value;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  async (
    response: AxiosResponse & {
      config?: AxiosRequestConfig & { _retry?: boolean };
    }
  ) => {
    const originalRequest = response.config; // We recover the original request that failed

    if (
      response.status === HttpStatusCode.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get(CookieKeys.REFRESHTOKEN)?.value;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
            validateStatus: () => true,
          }
        );

        if (response.status !== HttpStatusCode.OK) {
          cookieStore.delete(CookieKeys.ACCESSTOKEN);
          cookieStore.delete(CookieKeys.REFRESHTOKEN);

          return response;
        }

        const newAccessToken = response.data.accessToken;

        if (!newAccessToken) {
          cookieStore.delete(CookieKeys.ACCESSTOKEN);
          cookieStore.delete(CookieKeys.REFRESHTOKEN);

          return response;
        }

        // set newAccesToken
        await axios
          .post(
            `${process.env.NEXT_PUBLIC_CLIENT_DOMAIN}/api/auth/set-access-token`,
            {
              accessToken: newAccessToken,
            }
          );


        // replace authorization header with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // run original request
        const retryConfig = {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
          _retry: true,
        };
        return axios({
          ...retryConfig,
          baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
          withCredentials: true,
          validateStatus: () => true,
        });
      } catch (err) {
        console.error("Error in token refresh:", err);
        return response;
      }
    }

    return response;
  }
);

export default api;
