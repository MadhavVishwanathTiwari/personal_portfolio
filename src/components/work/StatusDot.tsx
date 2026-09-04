import { STATUS_LABEL, type ProjectStatus } from "@/data/types";
import { cn } from "@/lib/utils";

const dot: Record<ProjectStatus, string> = {
  live: "bg-live",
  wip: "bg-wip",
  internal: "bg-internal",
  research: "bg-research",
};

export function StatusDot({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <span className={cn("mono-label inline-flex items-center gap-2 text-text-faint", className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", dot[status])} />
      {STATUS_LABEL[status]}
    </span>
  );
}
