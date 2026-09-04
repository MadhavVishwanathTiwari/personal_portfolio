import Link from "next/link";
import { principles } from "@/data/principles";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion";

export function HowIWork() {
  return (
    <Section
      id="how-i-work"
      label="How I work"
      title="Four things I do the same way every time."
      lede="Each one names the system that proves it, so you can go and check."
    >
      <ol className="divide-y divide-hairline border-y border-hairline">
        {principles.map((p, i) => (
          <Reveal as="li" key={p.title} className="grid gap-5 py-9 md:grid-cols-[3.5rem_1fr]">
            <span aria-hidden className="mono-label pt-1.5 text-volt">
              {String(i + 1).padStart(2, "0")}
            </span>

            <div className="min-w-0">
              <h3 className="max-w-[42ch] text-lg leading-snug md:text-xl">{p.title}</h3>
              <p className="mt-3.5 max-w-[68ch] text-[15px] leading-[1.75] text-text-dim">
                {p.body}
              </p>
              <Link
                href={`/work/${p.evidenceSlug}`}
                className="mono-label mt-5 inline-block text-text-faint underline decoration-hairline-lit underline-offset-4 transition-colors hover:text-volt"
              >
                Evidence: {p.evidenceLabel}
              </Link>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
