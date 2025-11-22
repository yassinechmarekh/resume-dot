import { NextRequest, NextResponse } from "next/server";
import { AuthPages, CookieKeys, HttpStatusCode, Routes } from "./lib/constants";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(`/${Routes.DASHBOARD}`);
  const isAuthRoute = path.startsWith(`/${Routes.AUTH}`);

  const isLoggedIn = async (): Promise<boolean> => {
    const accessToken = req.cookies.get(CookieKeys.ACCESSTOKEN)?.value;

    if (!accessToken) {
      return false;
    }

    // First attempt to verify the token
    const verifyResponse = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    // If the token is valid
    if (verifyResponse.ok) {
      const data = await verifyResponse.json();
      return data.isAuthenticated || false;
    }

    // If unauthorized, attempt to refresh the token
    if (verifyResponse.status === HttpStatusCode.UNAUTHORIZED) {
      const refreshToken = req.cookies.get(CookieKeys.REFRESHTOKEN)?.value;

      if (!refreshToken) {
        return false;
      }

      try {
        // Request a new access token
        const refreshResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {
            method: "GET",
            headers: {
              Cookie: `refreshToken=${refreshToken}`,
            },
          }
        );

        if (!refreshResponse.ok) {
          return false;
        }

        const { accessToken: newAccessToken } = await refreshResponse.json();

        // Check the new token
        const newVerifyResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/verify-token`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (newVerifyResponse.ok) {
          const data = await newVerifyResponse.json();

          return data.isAuthenticated || false;
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
      }
    }

    return false;
  };

  const isAuthenticated = await isLoggedIn();

  // Redirect to /auth/login if the user is not authenticated
  if (!isAuthenticated && isProtectedRoute) {
    return NextResponse.redirect(
      new URL(`/${Routes.AUTH}/${AuthPages.LOGIN}`, req.nextUrl)
    );
  }

  // Redirect to / if the user is authenticated
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(`${Routes.ROOT}`, req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
