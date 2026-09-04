import type { Decision } from "@/data/types";
import { Chip } from "@/components/ui/Chip";
import { Reveal } from "@/components/motion";

/**
 * The centrepiece of every case study: a claim, and the reason it holds.
 * Everything else on the page exists to give these context, so they get the
 * most vertical space.
 */
export function DecisionList({ decisions }: { decisions: readonly Decision[] }) {
  return (
    <ol className="divide-y divide-hairline border-y border-hairline">
      {decisions.map((d, i) => (
        <Reveal as="li" key={d.claim} className="grid gap-5 py-9 md:grid-cols-[3.5rem_1fr]">
          <span aria-hidden className="mono-label pt-1.5 text-volt">
            {String(i + 1).padStart(2, "0")}
          </span>

          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
              <h3 className="max-w-[46ch] text-lg leading-snug text-text md:text-xl">
                {d.claim}
              </h3>
              {d.tag && <Chip className="mt-0.5 shrink-0">{d.tag}</Chip>}
            </div>
            <p className="mt-3.5 max-w-[68ch] text-[15px] leading-[1.75] text-text-dim">
              {d.why}
            </p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}
