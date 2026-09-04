import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";

export function Hero() {
  return (
    <section className="shell pt-36 pb-16 md:pt-48 md:pb-24">
      <span className="mono-label inline-flex items-center gap-2.5 text-text-faint">
        <span className="relative flex size-2">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-volt opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-volt" />
        </span>
        {profile.availability}
      </span>

      <h1 className="mt-8 max-w-[18ch] text-5xl leading-[1.02] md:text-7xl lg:text-8xl">
        {profile.shortName}
        <span className="text-text-faint">.</span>
      </h1>

      <p className="mt-8 max-w-[38ch] text-xl leading-[1.45] text-text md:max-w-[30ch] md:text-3xl">
        {profile.headline}
      </p>

      <p className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-text-dim">
        Seven production systems, five of them public. Below, each one with the
        decisions I would defend in a code review.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={profile.bookingUrl} variant="primary">
          Book a call
          <ArrowRight className="size-3.5" />
        </ButtonLink>
        <ButtonLink href="#work">See the work</ButtonLink>
      </div>
    </section>
  );
}
