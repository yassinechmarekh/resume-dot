import { NextRequest, NextResponse } from "next/server";
import { AuthPages, Routes } from "./lib/constants";
import { isLoggedInAction } from "./action/auth.action";

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = path.startsWith(`/${Routes.DASHBOARD}`);
  const isAuthRoute = path.startsWith(`/${Routes.AUTH}`);

  const isAuthenticated = await isLoggedInAction();

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
