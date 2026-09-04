import Image from "next/image";
import type { Shot } from "@/data/types";
import { cn } from "@/lib/utils";
import { BrowserFrame } from "./BrowserFrame";

/**
 * The aspect box is explicit and the source is a static import, so the space
 * is reserved before a single byte of the image arrives. That is the whole
 * layout-shift story for this site.
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
  const isMobile = shot.device === "mobile";

  return (
    <figure className={cn("min-w-0", className)}>
      <BrowserFrame url={shot.chrome}>
        <div
          className={cn(
            "relative overflow-hidden bg-panel-2",
            isMobile ? "aspect-[390/844]" : "aspect-[16/10]",
          )}
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
        <figcaption className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1">
          {shot.caption && (
            <span className="text-[13px] leading-relaxed text-text-faint">
              {shot.caption}
            </span>
          )}
          {shot.redacted && (
            <span className="mono-label text-text-faint/80">data redacted</span>
          )}
        </figcaption>
      )}
    </figure>
  );
}
