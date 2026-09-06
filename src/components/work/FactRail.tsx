import { ArrowUpRight } from "lucide-react";
import type { FeaturedProject } from "@/data/types";
import { StatusDot } from "./StatusDot";

function Row({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-hairline py-3 lg:flex-col lg:items-start lg:gap-1.5">
      <dt className="mono-label shrink-0 text-text-faint">{term}</dt>
      <dd className="text-right text-[14px] text-text-dim lg:text-left">{children}</dd>
    </div>
  );
}

export function FactRail({ project }: { project: FeaturedProject }) {
  return (
    <dl className="lg:sticky lg:top-24">
      <Row term="Role">{project.role}</Row>
      {project.client && <Row term="Client">{project.client}</Row>}
      <Row term="Year">{project.year}</Row>
      <Row term="Status">
        <StatusDot status={project.status} />
      </Row>
      <Row term="Stack">{project.stack[0]?.items.slice(0, 3).join(", ")}</Row>

      {project.links.length > 0 ? (
        <div className="pt-4">
          <ul className="space-y-2">
            {project.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 font-mono text-[13px] text-volt transition-colors hover:text-volt-dim"
                >
                  {link.label}
                  <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="pt-4 font-mono text-[13px] leading-relaxed text-text-faint">
          No public link. Screenshots below are from the running system.
        </p>
      )}
    </dl>
  );
}
