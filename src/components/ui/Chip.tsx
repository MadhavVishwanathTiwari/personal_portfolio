import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Chip({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-hairline px-2.5 py-1",
        "font-mono text-[11px] leading-none text-text-dim",
        className,
      )}
    >
      {children}
    </span>
  );
}
