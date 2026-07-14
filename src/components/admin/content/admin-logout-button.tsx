"use client";

export function AdminLogoutButton() {
  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-dust px-4 py-2 text-xs font-medium text-ash transition-colors hover:border-red hover:text-red"
    >
      Sign out
    </button>
  );
}
