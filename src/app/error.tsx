"use client";

import Link from "next/link";
import { PageWrapper } from "@/components/ui/page-wrapper";
import { Heading } from "@/components/ui/heading";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Button } from "@/components/ui/button";
import { FadeUp } from "@/components/ui/animate";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <PageWrapper
      maxWidth="md"
      className="h-screen flex justify-center items-center"
    >
      <FadeUp>
        <Eyebrow className="mb-4">Error</Eyebrow>
        <Heading as="h1" size="page" className="mb-6">
          Something went wrong
        </Heading>
        <p className="text-ash text-lg leading-relaxed">
          An unexpected error occurred. Try refreshing the page.
        </p>
        <div className="flex flex-wrap gap-3 mt-8">
          <Button size="lg" onClick={reset}>
            Try again
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg">
              Go home
            </Button>
          </Link>
        </div>
      </FadeUp>
    </PageWrapper>
  );
}
