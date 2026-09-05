import { Reveal } from "@/components/motion";

/**
 * Aggregates, and every one of them is countable in the repositories the
 * case studies describe. Nothing here is a growth number.
 */
const facts = [
  { value: "8", label: "systems shipped" },
  { value: "66", label: "Postgres tables designed" },
  { value: "75", label: "migrations shipped" },
  { value: "1", label: "engineer" },
];

export function ProofStrip() {
  return (
    <div className="shell">
      <dl className="grid grid-cols-2 gap-px overflow-hidden rounded border border-hairline bg-hairline lg:grid-cols-4">
        {facts.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.06} className="bg-void px-5 py-6">
            <dt className="sr-only">{f.label}</dt>
            <dd>
              <span className="block font-mono text-2xl leading-none text-text">
                {f.value}
              </span>
              <span className="mt-2.5 block text-[13px] text-text-faint">
                {f.label}
              </span>
            </dd>
          </Reveal>
        ))}
      </dl>
    </div>
  );
}
