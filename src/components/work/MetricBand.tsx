import type { Metric } from "@/data/types";
import { Reveal } from "@/components/motion";

export function MetricBand({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null;

  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded border border-hairline bg-hairline lg:grid-cols-4">
      {metrics.map((m, i) => (
        <Reveal key={m.label} delay={i * 0.06} className="bg-void px-5 py-6">
          <dt className="sr-only">{m.label}</dt>
          <dd>
            <span className="block font-mono text-2xl leading-none text-volt">
              {m.value}
            </span>
            <span className="mt-2.5 block text-[13px] leading-snug text-text-faint">
              {m.label}
            </span>
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
