import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a screenshot in a neutral chrome bar. Eight case studies means eight
 * different design systems on one page; the frame is what keeps a warm cream
 * site and a gold one sitting calmly on a green-black canvas instead of
 * fighting it, and it prints the live URL next to the claim.
 */
export function BrowserFrame({
  url,
  children,
  className,
}: {
  url?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded border border-hairline bg-panel",
        className,
      )}
    >
      <div className="flex h-7 items-center gap-3 border-b border-hairline px-3">
        <div aria-hidden className="flex gap-1.5">
          <span className="size-2 rounded-full bg-panel-2 ring-1 ring-hairline" />
          <span className="size-2 rounded-full bg-panel-2 ring-1 ring-hairline" />
          <span className="size-2 rounded-full bg-panel-2 ring-1 ring-hairline" />
        </div>
        {url && (
          <span className="truncate font-mono text-[11px] text-text-faint">{url}</span>
        )}
      </div>
      {children}
    </div>
  );
}
