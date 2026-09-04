import Image from "next/image";
import type { Shot } from "@/data/types";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./BrowserFrame";

/**
 * The aspect box comes from the image's own intrinsic dimensions, which a
 * static import gives us for free. An earlier version pinned every desktop
 * shot to 16:10 and let object-cover crop the difference, which quietly ate
 * the outer columns of anything wider — the CRM pipeline board is 2.07:1 and
 * lost a column at each end. A case study is the one place the whole frame
 * has to survive.
 *
 * The space is still reserved before a single byte arrives, because the
 * ratio is known at build time. That is the entire layout-shift story here.
 */
export function ShotFigure({
  shot,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 760px",
  className,
}: {
  shot: Shot;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <figure className={cn("min-w-0", className)}>
      <BrowserFrame url={shot.chrome}>
        <div
          className="relative overflow-hidden bg-panel-2"
          style={{ aspectRatio: `${shot.src.width} / ${shot.src.height}` }}
        >
          <Image
            src={shot.src}
            alt={shot.alt}
            fill
            sizes={sizes}
            placeholder="blur"
            priority={priority}
            className="object-cover object-top"
          />
        </div>
      </BrowserFrame>

      {(shot.caption || shot.redacted) && (
        <figcaption className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {shot.caption && (
            <span className="max-w-[68ch] text-[13px] leading-relaxed text-text-faint">
              {shot.caption}
            </span>
          )}
          {shot.redacted && (
            <span className="mono-label shrink-0 text-text-faint/80">
              data redacted
            </span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
