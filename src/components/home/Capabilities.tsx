import { capabilities } from "@/data/capabilities";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";

export function Capabilities() {
  return (
    <Section label="Capabilities" title="What I actually reach for.">
      <dl className="divide-y divide-hairline border-y border-hairline">
        {capabilities.map((c) => (
          <div key={c.area} className="grid gap-3 py-6 md:grid-cols-[11rem_1fr] md:gap-8">
            <dt className="mono-label pt-1.5 text-text-faint">{c.area}</dt>
            <dd className="flex flex-wrap gap-2">
              {c.items.map((item) => (
                <Chip key={item}>{item}</Chip>
              ))}
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
