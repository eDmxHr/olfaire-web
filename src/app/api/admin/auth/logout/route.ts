import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function POST() {
  (await cookies()).delete(ADMIN_SESSION_COOKIE);
  return NextResponse.json({ success: true });
}
