import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, getAdminUserFromToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { accessToken } = (await req.json()) as { accessToken?: string };
  const user = await getAdminUserFromToken(accessToken);

  if (!user || !accessToken) {
    return NextResponse.json(
      { error: "This account is not authorized for Content Studio." },
      { status: 403 },
    );
  }

  (await cookies()).set(ADMIN_SESSION_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  return NextResponse.json({ user });
}

export async function DELETE() {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
