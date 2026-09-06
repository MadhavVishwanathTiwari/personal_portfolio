"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import { ScrollProgress } from "@/components/motion";
import { cn } from "@/lib/utils";

const links = [
  { href: "/work", label: "Work", always: true },
  { href: "/#how-i-work", label: "How I work", always: false },
  { href: "/#contact", label: "Contact", always: false },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-14 transition-colors duration-300",
        scrolled && "border-b border-hairline bg-void/85 backdrop-blur-md",
      )}
    >
      <nav className="shell flex h-full items-center justify-between gap-4">
        <Link
          href="/"
          className="mono-label text-text transition-colors hover:text-volt"
          aria-label={`${profile.name} — home`}
        >
          {profile.initials}
          <span aria-hidden className="ml-2 text-volt">
            /
          </span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href} className={cn(!l.always && "hidden sm:block")}>
                <Link
                  href={l.href}
                  className="mono-label rounded px-3 py-2 text-text-dim transition-colors hover:text-text"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <a
            href={profile.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="mono-label rounded bg-volt px-3 py-2.5 text-void transition-colors hover:bg-volt-dim"
          >
            Book a call
          </a>
        </div>
      </nav>
      <ScrollProgress />
    </header>
  );
}
