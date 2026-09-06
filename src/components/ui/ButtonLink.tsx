import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost";

const base =
  "inline-flex items-center gap-2 rounded px-4 py-2.5 font-mono text-[13px] " +
  "tracking-[0.06em] transition-colors duration-200";

const variants: Record<Variant, string> = {
  primary: "bg-volt text-void hover:bg-volt-dim",
  ghost:
    "border border-hairline text-text hover:border-hairline-lit hover:text-volt",
};

export function ButtonLink({
  href,
  children,
  variant = "ghost",
  external,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  className?: string;
}) {
  const classes = cn(base, variants[variant], className);
  const isExternal = external ?? /^https?:/.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className={classes}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}
