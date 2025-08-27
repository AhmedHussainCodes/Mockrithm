import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const isMaintenance = process.env.NEXT_PUBLIC_MAINTENANCE === "true";

  const url = req.nextUrl.clone();

  // 🚧 Maintenance mode redirect
  if (isMaintenance && !req.nextUrl.pathname.startsWith("/maintenance")) {
    url.pathname = "/maintenance";
    return NextResponse.redirect(url);
  }

}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
