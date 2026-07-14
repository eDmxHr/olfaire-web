import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  ADMIN_SESSION_COOKIE,
  getAdminUserFromToken,
} from "@/lib/admin-auth";
import { checkRateLimit } from "@/lib/content-studio/rate-limit";

function getSupabaseLoginClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase authentication is not configured.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as {
      email?: string;
      password?: string;
    };

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 },
      );
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const limit = checkRateLimit(`login:${ip}:${email.toLowerCase()}`, 5);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again shortly." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        },
      );
    }

    const supabase = getSupabaseLoginClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session?.access_token) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    const user = await getAdminUserFromToken(data.session.access_token);
    if (!user) {
      return NextResponse.json(
        { error: "Unable to sign in." },
        { status: 403 },
      );
    }

    (await cookies()).set(ADMIN_SESSION_COOKIE, data.session.access_token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Content Studio login error:", error);
    return NextResponse.json(
      { error: "Login failed." },
      { status: 500 },
    );
  }
}
