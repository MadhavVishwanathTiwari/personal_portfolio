import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { FeaturedProject } from "@/data/types";

export function ProjectNav({
  prev,
  next,
}: {
  prev: FeaturedProject;
  next: FeaturedProject;
}) {
  return (
    <nav className="grid gap-px overflow-hidden rounded border border-hairline bg-hairline sm:grid-cols-2">
      <Link
        href={`/work/${prev.slug}`}
        className="group bg-void px-6 py-7 transition-colors hover:bg-panel"
      >
        <span className="mono-label inline-flex items-center gap-2 text-text-faint">
          <ArrowLeft className="size-3.5" />
          Previous
        </span>
        <span className="mt-3 block font-display text-lg text-text transition-colors group-hover:text-volt">
          {prev.title}
        </span>
      </Link>

      <Link
        href={`/work/${next.slug}`}
        className="group bg-void px-6 py-7 text-right transition-colors hover:bg-panel"
      >
        <span className="mono-label inline-flex items-center gap-2 text-text-faint">
          Next
          <ArrowRight className="size-3.5" />
        </span>
        <span className="mt-3 block font-display text-lg text-text transition-colors group-hover:text-volt">
          {next.title}
        </span>
      </Link>
    </nav>
  );
}
