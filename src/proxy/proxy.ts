import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded: any = jwt.verify(token!, process.env.JWT_SECRET!);

    if (
      pathname.startsWith("/dashboard/recruiter") &&
      decoded.role !== "RECRUITER"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (
      pathname.startsWith("/dashboard/jobseeker") &&
      decoded.role !== "JOB_SEEKER"
    ) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
