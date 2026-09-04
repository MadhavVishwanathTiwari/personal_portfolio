import { getFeatured } from "@/lib/projects";
import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/work/ProjectCard";
import { Reveal } from "@/components/motion";

export function SelectedWork() {
  const featured = getFeatured();

  return (
    <Section
      id="work"
      label="Selected work"
      title="Seven systems, and why they are built the way they are."
      lede="Each of these ran into a problem that had an obvious solution and a correct one. The case studies are about the difference."
    >
      <div className="divide-y divide-hairline">
        {featured.map((project, i) => (
          <Reveal key={project.slug}>
            <ProjectCard project={project} index={i} priority={i === 0} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
