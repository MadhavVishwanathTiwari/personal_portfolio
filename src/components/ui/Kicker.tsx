import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Tick } from "@/components/motion";

/** Uppercase mono micro-label with a leading volt tick that draws itself in. */
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
      <Tick className="h-px w-4 bg-volt-dim" />
      {children}
    </span>
  );
}
