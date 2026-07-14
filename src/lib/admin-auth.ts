import "server-only";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const ADMIN_SESSION_COOKIE = "olfaire_admin_session";

export interface AdminUser {
  id: string;
  email: string;
}

function getSupabaseForAuth() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Unable to verify admin access.");
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function isContentStudioAdmin(user: AdminUser) {
  const supabase = getSupabaseForAuth();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .or(`user_id.eq.${user.id},email.eq.${user.email.toLowerCase()}`)
    .eq("active", true)
    .maybeSingle();

  return !error && Boolean(data);
}

export async function getAdminUserFromToken(
  accessToken: string | undefined,
): Promise<AdminUser | null> {
  if (!accessToken) return null;

  let data;
  let error;
  try {
    const supabase = getSupabaseForAuth();
    const result = await supabase.auth.getUser(accessToken);
    data = result.data;
    error = result.error;
  } catch {
    return null;
  }

  if (error || !data.user?.email) {
    return null;
  }

  const user = {
    id: data.user.id,
    email: data.user.email,
  };

  if (!(await isContentStudioAdmin(user))) {
    return null;
  }

  return user;
}

export async function getCurrentAdminUser() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  return getAdminUserFromToken(token);
}

export async function requireAdminUser() {
  const user = await getCurrentAdminUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireAdminApi() {
  const user = await getCurrentAdminUser();
  if (!user) {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Admin authentication required." },
        { status: 401 },
      ),
    };
  }

  return { user, response: null };
}
