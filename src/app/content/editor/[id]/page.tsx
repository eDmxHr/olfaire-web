import { ContentStudioShell } from "@/components/admin/content/content-studio-shell";
import { getDraft } from "@/lib/content-studio/drafts";
import { requireAdminUser } from "@/lib/admin-auth";
import { EditorWorkspace } from "@/components/admin/content/editor-workspace";
import { notFound } from "next/navigation";

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
  let draft;
  try {
    draft = await getDraft(id);
  } catch {
    notFound();
  }

  return (
    <ContentStudioShell userEmail={user.email}>
      <EditorWorkspace initialDraft={draft} />
    </ContentStudioShell>
  );
}
