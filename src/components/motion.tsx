"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import type { ReactNode } from "react";

/**
 * Every animation on the site lives in this file, which is what keeps the
 * pages themselves server components.
 *
 * The rule the whole set follows: motion may draw attention to something
 * arriving, and may never delay reading it. Nothing moves more than about
 * 16px, nothing runs longer than half a second, and under
 * prefers-reduced-motion everything resolves instantly rather than running a
 * faster version of the same movement.
 *
 * Note the shape of that last part. `useReducedMotion` reads a media query,
 * so it is false during server rendering and can be true on the client.
 * Branching on it to render a *different* element hydrates badly: the server
 * sends `opacity: 0`, the client renders an element that never had that
 * style, React reports a mismatch and refuses to patch it, and the content
 * stays invisible. So the element and its `initial` are always identical in
 * both passes, and only the transition duration collapses to zero.
 */

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 0.5;

/** Fades up when scrolled into view. The workhorse. */
export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-64px" }}
      transition={
        reduced
          ? { duration: 0, delay: 0 }
          : { duration: DURATION, delay, ease: EASE }
      }
    >
      {children}
    </Tag>
  );
}

/**
 * Fades up on mount rather than on scroll. For anything above the fold,
 * where a scroll trigger would either fire instantly or never.
 */
export function Rise({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "h1" | "p" | "span";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];

  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduced
          ? { duration: 0, delay: 0 }
          : { duration: 0.55, delay, ease: EASE }
      }
    >
      {children}
    </Tag>
  );
}

/**
 * The volt dash in front of a kicker, and the rule under a section heading,
 * drawing themselves in as the section arrives. The smallest gesture on the
 * site and the one that appears most often, so it stays brief.
 */
export function Tick({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <motion.span
      aria-hidden
      className={className}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={reduced ? { duration: 0 } : { duration: 0.45, ease: EASE }}
      style={{ originX: 0 }}
    />
  );
}

/**
 * A one-pixel reading-progress rule along the bottom of the nav. It earns
 * its place on the case studies, which are long, and costs nothing on the
 * pages that are not.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      className="absolute inset-x-0 bottom-0 h-px origin-left bg-volt"
      style={{ scaleX }}
    />
  );
}
