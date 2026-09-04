import { getSecondary } from "@/lib/projects";
import { Section } from "@/components/ui/Section";
import { SecondaryCard } from "@/components/work/SecondaryCard";
import { Reveal } from "@/components/motion";

export function AlsoBuilt() {
  const secondary = getSecondary();

  return (
    <Section
      label="Also built"
      title="Smaller things, kept short."
      lede="No case studies here on purpose. One interesting decision each is the whole point."
    >
      <ul className="grid gap-5 md:grid-cols-2">
        {secondary.map((project, i) => (
          <Reveal as="li" key={project.slug} delay={i * 0.05}>
            <SecondaryCard project={project} />
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
