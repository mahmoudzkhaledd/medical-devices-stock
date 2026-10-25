import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth";
import { isUrlMatching } from "./lib/utils";
import { appRoutes } from "./constants/app-routes";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const user = (await getSession().catch(() => null))?.user;
  if (user) {
    requestHeaders.set("x-proxy-user-id", user.id);
  }
  const route = request.nextUrl;

  const isLoggedIn = user != null;
  const isPublicRoute = isUrlMatching(route.pathname, appRoutes.public);
  const isAuthRoute = isUrlMatching(route.pathname, appRoutes.auth);

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard/home", route));
  }

  if (!isLoggedIn && !isPublicRoute && !isAuthRoute) {
    return NextResponse.redirect(new URL("/", route));
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!.well-known|api|_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
