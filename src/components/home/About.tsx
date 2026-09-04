import { profile } from "@/data/profile";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";

export function About() {
  return (
    <Section label="About" title="One person, the whole stack.">
      <div className="grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <Prose paragraphs={[...profile.bio]} />

        <dl className="self-start divide-y divide-hairline border-y border-hairline text-[13px]">
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="mono-label whitespace-nowrap text-text-faint">Based in</dt>
            <dd className="text-right text-text-dim">{profile.location}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="mono-label whitespace-nowrap text-text-faint">Role</dt>
            <dd className="text-right text-text-dim">{profile.role}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 py-3">
            <dt className="mono-label whitespace-nowrap text-text-faint">Status</dt>
            <dd className="text-right text-text-dim">{profile.availability}</dd>
          </div>
        </dl>
      </div>
    </Section>
  );
}
