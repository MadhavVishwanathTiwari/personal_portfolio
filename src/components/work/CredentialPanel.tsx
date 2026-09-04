import Image from "next/image";
import type { Credential } from "@/data/types";
import { Kicker } from "@/components/ui/Kicker";

/**
 * Used sparingly, and only where a third party signed the claim. A line the
 * client wrote outranks another paragraph from me.
 */
export function CredentialPanel({ credential }: { credential: Credential }) {
  return (
    <section className="grid gap-8 rounded border border-hairline bg-panel p-6 md:p-9 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
      <div className="min-w-0 lg:order-2">
        <div className="overflow-hidden rounded border border-hairline">
          <Image
            src={credential.image}
            alt={credential.alt}
            sizes="(max-width: 1024px) 100vw, 560px"
            placeholder="blur"
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className="min-w-0 lg:order-1">
        <Kicker>Verified by the client</Kicker>
        <h2 className="mt-4 text-2xl leading-snug md:text-3xl">
          {credential.title}
        </h2>
        <p className="mono-label mt-3 text-text-faint">{credential.issuer}</p>
        <p className="mt-5 max-w-[52ch] text-[15px] leading-[1.75] text-text-dim">
          {credential.note}
        </p>
        {credential.reference && (
          <p className="mono-label mt-6 text-text-faint">{credential.reference}</p>
        )}
      </div>
    </section>
  );
}
