import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Uppercase mono micro-label with a leading volt tick. */
export function Kicker({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "mono-label inline-flex items-center gap-2 text-text-faint",
        className,
      )}
    >
      <span aria-hidden className="h-px w-4 bg-volt-dim" />
      {children}
    </span>
  );
}
