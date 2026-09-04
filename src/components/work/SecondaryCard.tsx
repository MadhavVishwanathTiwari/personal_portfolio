import { ArrowUpRight } from "lucide-react";
import type { SecondaryProject } from "@/data/types";
import { Chip } from "@/components/ui/Chip";
import { StatusDot } from "./StatusDot";

export function SecondaryCard({ project }: { project: SecondaryProject }) {
  const link = project.links[0];
  const chips = project.stack.flatMap((g) => g.items).slice(0, 3);

  return (
    <article className="flex h-full flex-col rounded border border-hairline bg-panel p-6 transition-colors hover:border-hairline-lit">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-lg leading-snug">{project.title}</h3>
        <StatusDot status={project.status} className="mt-1.5 shrink-0" />
      </div>

      <p className="mt-3 text-[14px] leading-relaxed text-text-dim">{project.note}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {chips.map((c) => (
          <li key={c}>
            <Chip>{c}</Chip>
          </li>
        ))}
      </ul>

      {link && (
        <a
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="group mt-6 inline-flex items-center gap-1.5 font-mono text-[12px] text-volt transition-colors hover:text-volt-dim"
        >
          {link.label}
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </a>
      )}
    </article>
  );
}
