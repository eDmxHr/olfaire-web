import type { Metadata } from "next";
import Link from "next/link";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/animate";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
  return (
    <PageWrapper
      maxWidth="md"
      className="h-screen flex justify-center items-center"
    >
      <FadeUp>
        <Eyebrow className="mb-4">404</Eyebrow>
        <Heading as="h1" size="page" className="mb-6">
          Lost in the collection
        </Heading>
        <p className="text-ash text-lg leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Link href="/">
            <Button size="lg">Go home</Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" size="lg">
              Read the blog
            </Button>
          </Link>
        </div>
      </FadeUp>
    </PageWrapper>
  );
}
