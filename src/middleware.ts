import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { jwtVerify } from "jose";

const COOKIE_NAME = "aqua_session";

type SessionPayload = {
  userId: string;
  role: "USER" | "ADMIN";
};

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

async function getSession(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(
      token,
      getSecret()
    );

    if (
      typeof payload.userId !== "string" ||
      (payload.role !== "USER" &&
        payload.role !== "ADMIN")
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      role: payload.role,
    } satisfies SessionPayload;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const session = await getSession(request);

  /*
   * --------------------------------------------------
   * LOGGED-IN USERS CANNOT ACCESS AUTH PAGES
   * --------------------------------------------------
   */
  if (
    session &&
    (pathname === "/login" ||
      pathname === "/register")
  ) {
    if (session.role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  /*
   * --------------------------------------------------
   * USER AREA
   * --------------------------------------------------
   */
  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  ) {
    if (!session) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (session.role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * ADMIN AREA
   * --------------------------------------------------
   */
  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    if (!session) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }

    if (session.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
    }

    return NextResponse.next();
  }

  /*
   * --------------------------------------------------
   * AUTHENTICATED USER/ADMIN CANNOT USE PUBLIC PAGES
   * --------------------------------------------------
   */
  if (session) {
    if (session.role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }

    return NextResponse.redirect(
      new URL("/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Run middleware on all application pages.
     *
     * Static files, Next internals and API routes
     * are excluded.
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};