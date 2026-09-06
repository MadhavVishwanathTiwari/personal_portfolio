import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-hairline py-10">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={`mailto:${profile.email}`}
            className="font-mono text-[13px] text-text-dim transition-colors hover:text-volt"
          >
            {profile.email}
          </a>
          <a
            href={profile.phoneHref}
            className="font-mono text-[13px] text-text-dim transition-colors hover:text-volt"
          >
            {profile.phone}
          </a>
          <Link
            href="/work"
            className="font-mono text-[13px] text-text-dim transition-colors hover:text-volt"
          >
            All work
          </Link>
        </div>

        <p className="mono-label text-text-faint">
          {profile.shortName} · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
