import type { StackGroup } from "@/data/types";
import { Chip } from "@/components/ui/Chip";

export function StackGrid({ stack }: { stack: StackGroup[] }) {
  return (
    <dl className="divide-y divide-hairline border-y border-hairline">
      {stack.map((group) => (
        <div key={group.layer} className="grid gap-3 py-5 md:grid-cols-[9rem_1fr] md:gap-6">
          <dt className="mono-label pt-1.5 text-text-faint">{group.layer}</dt>
          <dd className="flex flex-wrap gap-2">
            {group.items.map((item) => (
              <Chip key={item}>{item}</Chip>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
