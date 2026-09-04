import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Kicker } from "./Kicker";

export function Section({
  id,
  label,
  title,
  lede,
  children,
  className,
}: {
  id?: string;
  label?: string;
  title?: string;
  lede?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="shell">
        {(label || title) && (
          <header className="mb-12 max-w-2xl md:mb-16">
            {label && <Kicker>{label}</Kicker>}
            {title && (
              <h2 className="mt-4 text-3xl leading-[1.1] md:text-4xl">{title}</h2>
            )}
            {lede && (
              <p className="mt-4 text-[15px] leading-relaxed text-text-dim">{lede}</p>
            )}
            <div className="rule-fade mt-8" />
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
