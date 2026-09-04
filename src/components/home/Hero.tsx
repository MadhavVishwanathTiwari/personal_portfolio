import { ArrowRight } from "lucide-react";
import { profile } from "@/data/profile";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Rise } from "@/components/motion";

export function Hero() {
  return (
    <section className="shell pt-36 pb-16 md:pt-48 md:pb-24">
      <Rise as="span" delay={0.05}>
        <span className="mono-label inline-flex items-center gap-2.5 text-text-faint">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-volt opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-volt" />
          </span>
          {profile.availability}
        </span>
      </Rise>

      <Rise
        as="h1"
        delay={0.12}
        className="mt-8 max-w-[18ch] text-5xl leading-[1.02] md:text-7xl lg:text-8xl"
      >
        {profile.shortName}
        <span className="text-text-faint">.</span>
      </Rise>

      <Rise
        as="p"
        delay={0.2}
        className="mt-8 max-w-[38ch] text-xl leading-[1.45] text-text md:max-w-[30ch] md:text-3xl"
      >
        {profile.headline}
      </Rise>

      <Rise
        as="p"
        delay={0.28}
        className="mt-6 max-w-[56ch] text-[15px] leading-relaxed text-text-dim"
      >
        Six production systems and one research project. Four you can open
        right now. Each one below carries the decisions I would defend in a
        code review.
      </Rise>

      <Rise delay={0.36} className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href={profile.bookingUrl} variant="primary">
          Book a call
          <ArrowRight className="size-3.5" />
        </ButtonLink>
        <ButtonLink href="#work">See the work</ButtonLink>
      </Rise>
    </section>
  );
}
