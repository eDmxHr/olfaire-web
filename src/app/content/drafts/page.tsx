import { ContentStudioShell } from "@/components/admin/content/content-studio-shell";
import { DraftsTable } from "@/components/admin/content/drafts-table";
import { requireAdminUser } from "@/lib/admin-auth";

export const metadata = {
  title: "Drafts",
};

export default async function DraftsPage() {
  const user = await requireAdminUser();
  return (
    <ContentStudioShell userEmail={user.email}>
      <DraftsTable />
    </ContentStudioShell>
  );
}
