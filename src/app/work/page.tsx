import type { Metadata } from "next";
import { getFeatured, getSecondary } from "@/lib/projects";
import { buildMetadata } from "@/lib/seo";
import { Section } from "@/components/ui/Section";
import { Kicker } from "@/components/ui/Kicker";
import { ProjectCard } from "@/components/work/ProjectCard";
import { SecondaryCard } from "@/components/work/SecondaryCard";
import { Contact } from "@/components/home/Contact";
import { Reveal } from "@/components/motion";

export const metadata: Metadata = buildMetadata({
  title: "Work",
  description:
    "Eight case studies and four smaller builds, with the engineering decisions behind each one.",
  path: "/work",
});

export default function WorkPage() {
  const featured = getFeatured();
  const secondary = getSecondary();

  return (
    <>
      <header className="shell pt-36 pb-4 md:pt-44">
        <Kicker>All work</Kicker>
        <h1 className="mt-5 max-w-[16ch] text-4xl leading-[1.05] md:text-6xl">
          Everything, with the reasoning attached.
        </h1>
        <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-text-dim">
          Eight case studies and four smaller builds. Where a system is behind a
          login there is no link, and the screenshots say so.
        </p>
      </header>

      <Section>
        <div className="divide-y divide-hairline">
          {featured.map((project, i) => (
            <Reveal key={project.slug}>
              <ProjectCard project={project} index={i} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section label="Also built" title="Smaller things, kept short.">
        <ul className="grid gap-5 md:grid-cols-2">
          {secondary.map((project, i) => (
            <Reveal as="li" key={project.slug} delay={i * 0.05}>
              <SecondaryCard project={project} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Contact />
    </>
  );
}
