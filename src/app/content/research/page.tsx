import { ContentStudioShell } from "@/components/admin/content/content-studio-shell";
import { ResearchWorkspace } from "@/components/admin/content/research-workspace";
import { requireAdminUser } from "@/lib/admin-auth";

export const metadata = {
  title: "Research",
};

export default async function ResearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  const user = await requireAdminUser();
  const { keyword } = await searchParams;
  return (
    <ContentStudioShell userEmail={user.email}>
      <ResearchWorkspace initialKeyword={keyword} />
    </ContentStudioShell>
  );
}
