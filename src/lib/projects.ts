import { projects } from "@/data/projects";
import { isFeatured, type FeaturedProject, type Project, type SecondaryProject } from "@/data/types";

export const getAll = (): Project[] => projects;

export const getFeatured = (): FeaturedProject[] => projects.filter(isFeatured);

export const getSecondary = (): SecondaryProject[] =>
  projects.filter((p): p is SecondaryProject => !p.featured);

export const getBySlug = (slug: string): FeaturedProject | undefined =>
  getFeatured().find((p) => p.slug === slug);

/** Previous and next case study, wrapping at both ends. */
export function getAdjacent(slug: string): {
  prev: FeaturedProject;
  next: FeaturedProject;
} | null {
  const featured = getFeatured();
  const i = featured.findIndex((p) => p.slug === slug);
  if (i === -1) return null;
  return {
    prev: featured[(i - 1 + featured.length) % featured.length],
    next: featured[(i + 1) % featured.length],
  };
}
