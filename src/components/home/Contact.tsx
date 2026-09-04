import { ArrowRight, Mail, Phone } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/ButtonLink";

/**
 * No form. A form here would be a database, a spam problem and a thing that
 * can silently fail; the two links below cannot.
 */
export function Contact() {
  return (
    <Section id="contact" label="Contact">
      <div className="rounded border border-hairline bg-panel p-8 md:p-12">
        <h2 className="max-w-[20ch] text-3xl leading-[1.1] md:text-5xl">
          Tell me what you are trying to ship.
        </h2>

        <p className="mt-5 max-w-[52ch] text-[15px] leading-relaxed text-text-dim">
          If it involves a database that has to be right, an AI feature that has
          to be trustworthy, or a site a non-technical client will run
          themselves, that is the work I do. {profile.responseWindow}
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href={profile.bookingUrl} variant="primary">
            Book a call
            <ArrowRight className="size-3.5" />
          </ButtonLink>
          <ButtonLink href={`mailto:${profile.email}`}>
            <Mail className="size-3.5" />
            {profile.email}
          </ButtonLink>
          <ButtonLink href={profile.phoneHref}>
            <Phone className="size-3.5" />
            {profile.phone}
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}
