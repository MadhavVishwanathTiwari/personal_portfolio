import { Kicker } from "@/components/ui/Kicker";
import { ButtonLink } from "@/components/ui/ButtonLink";

export default function NotFound() {
  return (
    <section className="shell flex min-h-[70vh] flex-col justify-center py-32">
      <Kicker>404</Kicker>
      <h1 className="mt-5 max-w-[16ch] text-4xl leading-[1.05] md:text-6xl">
        Nothing at this address.
      </h1>
      <p className="mt-5 max-w-[48ch] text-[15px] leading-relaxed text-text-dim">
        The work is all one click away.
      </p>
      <div className="mt-9 flex flex-wrap gap-3">
        <ButtonLink href="/work" variant="primary">
          All work
        </ButtonLink>
        <ButtonLink href="/">Home</ButtonLink>
      </div>
    </section>
  );
}
