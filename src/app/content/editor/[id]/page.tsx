import { ContentStudioShell } from "@/components/admin/content/content-studio-shell";
import { getDraft } from "@/lib/content-studio/drafts";
import { requireAdminUser } from "@/lib/admin-auth";
import { EditorWorkspace } from "@/components/admin/content/editor-workspace";

export const metadata = {
  title: "Editor",
};

export default async function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireAdminUser();
  const { id } = await params;
  const draft = await getDraft(id);
  return (
    <ContentStudioShell userEmail={user.email}>
      <EditorWorkspace initialDraft={draft} />
    </ContentStudioShell>
  );
}
