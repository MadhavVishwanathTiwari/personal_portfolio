import { cn } from "@/lib/utils";

/** Body copy for case-study paragraphs. One measure, one rhythm. */
export function Prose({
  paragraphs,
  className,
}: {
  paragraphs: string[];
  className?: string;
}) {
  return (
    <div className={cn("space-y-5", className)}>
      {paragraphs.map((p, i) => (
        <p key={i} className="max-w-[65ch] text-[15px] leading-[1.75] text-text-dim">
          {p}
        </p>
      ))}
    </div>
  );
}
