import { AdminLoginForm } from "@/components/admin/content/admin-login-form";
import { Heading } from "@/components/ui/heading";
import { PageWrapper } from "@/components/ui/page-wrapper";

export const metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <PageWrapper maxWidth="sm">
      <div className="pt-16">
        <p className="eyebrow text-amber mb-4">Internal</p>
        <Heading as="h1" size="page" className="mb-5">
          Content Studio.
        </Heading>
        <p className="text-ash leading-relaxed mb-8">
          Sign in to research, draft, and prepare Olfaire articles for review.
        </p>
        <AdminLoginForm />
      </div>
    </PageWrapper>
  );
}
