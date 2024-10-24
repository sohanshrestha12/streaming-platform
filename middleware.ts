import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const publicRoutes = ["/sign-in"];
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  if (!token.username) {
    if (req.nextUrl.pathname === "/username-form") {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/username-form", req.url));
    }
  }

  if (token.username && req.nextUrl.pathname === "/username-form") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/username-form"],
};
