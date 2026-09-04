import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { FeaturedProject } from "@/data/types";
import { cn } from "@/lib/utils";
import { Chip } from "@/components/ui/Chip";
import { StatusDot } from "./StatusDot";
import { BrowserFrame } from "./BrowserFrame";

/**
 * One row per featured project, alternating sides on desktop. The whole row
 * is a single link, so keyboard users get one stop per project rather than
 * three.
 */
export function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: FeaturedProject;
  index: number;
  priority?: boolean;
}) {
  const shot = project.shots[0];
  const flipped = index % 2 === 1;
  const chips = project.stack.flatMap((g) => g.items).slice(0, 4);

  return (
    <Link
      href={`/work/${project.slug}`}
      className="group grid items-center gap-8 rounded py-10 lg:grid-cols-2 lg:gap-14"
    >
      <div className={cn("min-w-0", flipped && "lg:order-2")}>
        <BrowserFrame
          url={shot.chrome}
          className="transition-colors duration-300 group-hover:border-hairline-lit"
        >
          <div className="relative aspect-[16/10] overflow-hidden bg-panel-2">
            <Image
              src={shot.src}
              alt={shot.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              placeholder="blur"
              priority={priority}
              className="object-cover object-top transition-transform duration-500 ease-[var(--ease-out-fast)] group-hover:scale-[1.02]"
            />
          </div>
        </BrowserFrame>
      </div>

      <div className={cn("min-w-0", flipped && "lg:order-1")}>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="mono-label text-volt">
            {String(index + 1).padStart(2, "0")}
          </span>
          <StatusDot status={project.status} />
          {project.client && (
            <span className="mono-label text-text-faint">{project.client}</span>
          )}
        </div>

        <h3 className="mt-4 text-2xl leading-tight transition-colors group-hover:text-volt md:text-3xl">
          {project.title}
        </h3>

        <p className="mt-3 max-w-[46ch] text-[15px] leading-relaxed text-text-dim">
          {project.pitch}
        </p>

        <ul className="mt-6 flex flex-wrap gap-2">
          {chips.map((c) => (
            <li key={c}>
              <Chip>{c}</Chip>
            </li>
          ))}
        </ul>

        <span className="mono-label mt-7 inline-flex items-center gap-2 text-text-faint transition-colors group-hover:text-volt">
          Read the case study
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
