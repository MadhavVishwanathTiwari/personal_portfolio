import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacent, getBySlug, getFeatured } from "@/lib/projects";
import { buildMetadata } from "@/lib/seo";
import { Kicker } from "@/components/ui/Kicker";
import { Prose } from "@/components/ui/Prose";
import { CaseHeader } from "@/components/work/CaseHeader";
import { FactRail } from "@/components/work/FactRail";
import { MetricBand } from "@/components/work/MetricBand";
import { DecisionList } from "@/components/work/DecisionList";
import { StackGrid } from "@/components/work/StackGrid";
import { ShotFigure } from "@/components/work/ShotFigure";
import { ShotGallery } from "@/components/work/ShotGallery";
import { VideoFigure } from "@/components/work/VideoFigure";
import { CredentialPanel } from "@/components/work/CredentialPanel";
import { ProjectNav } from "@/components/work/ProjectNav";
import { Contact } from "@/components/home/Contact";

export const dynamicParams = false;

export function generateStaticParams() {
  return getFeatured().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getBySlug(slug);
  if (!project) return {};

  return buildMetadata({
    title: project.title,
    description: project.pitch,
    path: `/work/${project.slug}`,
  });
}

export default async function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getBySlug(slug);
  if (!project) notFound();

  const adjacent = getAdjacent(slug);
  const [heroShot, ...restShots] = project.shots;

  return (
    <>
      <CaseHeader project={project} />

      <div className="shell mt-12 md:mt-16">
        <ShotFigure
          shot={heroShot}
          priority
          sizes="(max-width: 1200px) 100vw, 1100px"
        />
      </div>

      {/* Problem, with the facts pinned alongside it. */}
      <div className="shell mt-20 grid gap-12 lg:grid-cols-[1fr_var(--spacing-rail)] lg:gap-16">
        <div className="min-w-0 lg:order-1">
          <Kicker>The problem</Kicker>
          <p className="mt-5 max-w-[62ch] text-lg leading-[1.7] text-text md:text-xl">
            {project.problem}
          </p>
          <Prose paragraphs={[project.summary]} className="mt-6" />
        </div>

        <aside className="lg:order-2">
          <FactRail project={project} />
        </aside>
      </div>

      <div className="shell mt-16">
        <MetricBand metrics={project.metrics} />
      </div>

      {project.video && (
        <section className="shell mt-24">
          <header className="mb-6">
            <Kicker>Watch it run</Kicker>
          </header>
          <VideoFigure video={project.video} />
        </section>
      )}

      <section className="shell mt-24">
        <Kicker>How it works</Kicker>
        <div className="mt-6 grid gap-12 lg:grid-cols-[minmax(0,34rem)_1fr] lg:gap-16">
          <Prose paragraphs={project.approach} />
          <div className="min-w-0">
            <ShotGallery shots={restShots} />
          </div>
        </div>
      </section>

      <section className="shell mt-24 md:mt-32">
        <header className="mb-10 max-w-2xl">
          <Kicker>Decisions worth defending</Kicker>
          <h2 className="mt-4 text-3xl leading-[1.1] md:text-4xl">
            The parts I would argue for in a review.
          </h2>
        </header>
        <DecisionList decisions={project.decisions} />
      </section>

      <section className="shell mt-24">
        <header className="mb-8">
          <Kicker>Stack</Kicker>
        </header>
        <StackGrid stack={project.stack} />
      </section>

      {project.credential && (
        <section className="shell mt-24">
          <CredentialPanel credential={project.credential} />
        </section>
      )}

      <section className="shell mt-24">
        <div className="border-l-2 border-volt bg-panel py-7 pl-7 pr-6 md:pl-9">
          <Kicker>Where it stands</Kicker>
          <p className="mt-4 max-w-[62ch] text-[15px] leading-[1.75] text-text-dim">
            {project.outcome}
          </p>
        </div>
      </section>

      {adjacent && (
        <div className="shell mt-24">
          <ProjectNav prev={adjacent.prev} next={adjacent.next} />
        </div>
      )}

      <Contact />
    </>
  );
}
