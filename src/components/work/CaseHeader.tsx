import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { FeaturedProject } from "@/data/types";
import { StatusDot } from "./StatusDot";

export function CaseHeader({ project }: { project: FeaturedProject }) {
  return (
    <header className="shell pt-28 md:pt-32">
      <Link
        href="/work"
        className="mono-label inline-flex items-center gap-2 text-text-faint transition-colors hover:text-volt"
      >
        <ArrowLeft className="size-3.5" />
        All work
      </Link>

      <div className="mt-10 flex flex-wrap items-center gap-x-5 gap-y-2">
        <span className="mono-label text-text-faint">{project.role}</span>
        <span aria-hidden className="mono-label text-hairline-lit">
          /
        </span>
        <span className="mono-label text-text-faint">{project.year}</span>
        <StatusDot status={project.status} />
      </div>

      <h1 className="mt-5 text-4xl leading-[1.05] md:text-6xl">{project.title}</h1>

      <p className="mt-5 max-w-[52ch] text-lg leading-relaxed text-text-dim md:text-xl">
        {project.pitch}
      </p>

      {project.links.length > 0 && (
        <ul className="mt-7 flex flex-wrap gap-3">
          {project.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 rounded border border-hairline px-4 py-2.5 font-mono text-[13px] text-text transition-colors hover:border-hairline-lit hover:text-volt"
              >
                {link.label}
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
