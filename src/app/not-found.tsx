import { PackageSearch } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary-50 ring-1 ring-primary-200/70">
        <PackageSearch size={32} className="text-primary-600" strokeWidth={1.5} />
      </div>
      <div>
        <h1 className="font-display text-3xl font-extrabold text-ink-900 sm:text-4xl">Page Not Found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-500">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
      </div>
      <Button href="/" withIcon>
        Back to Home
      </Button>
    </Container>
  );
}
