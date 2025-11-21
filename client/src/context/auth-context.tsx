"use client";

import { getProfileDataAction } from "@/action/auth.action";
import { CookieKeys, HttpStatusCode, Routes } from "@/lib/constants";
import { UserType } from "@/types";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: UserType | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  fetchUser: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  const fetchUser = async () => {
    try {
      setIsLoading(true);
      setUser(await getProfileDataAction());
    } catch (error) {
      console.log("Fetch User Error :", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      const token = Cookies.get(CookieKeys.ACCESSTOKEN);

      if (!token) {
        return;
      }

      const makeLogoutRequest = async (authToken: string) => {
        return axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
          withCredentials: true,
          validateStatus: () => true,
          headers: { Authorization: `Bearer ${authToken}` },
        });
      };

      let result = await makeLogoutRequest(token);

      // Retry with token refresh if unauthorized
      if (result.status === HttpStatusCode.UNAUTHORIZED) {
        const refreshResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            withCredentials: true,
            validateStatus: () => true,
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (refreshResponse.status !== HttpStatusCode.OK) {
          toast.error("Logout error", {
            description: "Session refresh failed.",
          });
          return;
        }

        const newToken = refreshResponse.data.accessToken;
        Cookies.set(CookieKeys.ACCESSTOKEN, newToken, {
          expires: new Date(15 * 60 * 1000),
        });

        result = await makeLogoutRequest(newToken);
      }

      // Handle final logout result
      if (result.status !== HttpStatusCode.OK) {
        console.error("Logout failed:", result);
        toast.error("Logout error", {
          description: "Internal server error.",
        });
        return;
      }

      // Success: clean up and redirect
      setIsLoading(true);
      Cookies.remove(CookieKeys.ACCESSTOKEN);
      setUser(null);
      router.push(Routes.ROOT);
    } catch (error) {
      console.error("Logout Error:", error);
      toast.error("Logout error", {
        description: "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    fetchUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
