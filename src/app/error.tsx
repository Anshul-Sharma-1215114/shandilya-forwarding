"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[app error boundary]", error);
  }, [error]);

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent-50 ring-1 ring-accent-200/70">
        <AlertTriangle size={32} className="text-accent-600" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Something Went Wrong</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
          We hit an unexpected error loading this page. Please try again.
        </p>
      </div>
      <Button onClick={() => reset()} withIcon>
        Try Again
      </Button>
    </Container>
  );
}
