import Image from "next/image";
import { profile } from "@/data/profile";
import portrait from "@/assets/portrait.jpg";
import { Section } from "@/components/ui/Section";
import { Prose } from "@/components/ui/Prose";

export function About() {
  return (
    <Section label="About" title="One person, the whole stack.">
      <div className="grid gap-10 lg:grid-cols-[1fr_16rem] lg:gap-16">
        <Prose paragraphs={[...profile.bio]} />

        <div className="self-start">
          <div className="overflow-hidden rounded border border-hairline">
            <Image
              src={portrait}
              alt={profile.name}
              sizes="(max-width: 1024px) 12rem, 16rem"
              placeholder="blur"
              className="h-auto w-full"
            />
          </div>

          <dl className="mt-6 divide-y divide-hairline border-y border-hairline text-[13px]">
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
      </div>
    </Section>
  );
}
