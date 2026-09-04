import type { Video } from "@/data/types";
import { BrowserFrame } from "./BrowserFrame";

/**
 * Sits in the same frame as the screenshots so a walkthrough reads as another
 * view of the product rather than a different kind of object. The aspect box
 * is explicit for the same reason it is on ShotFigure: nothing may reflow when
 * the player loads.
 */
export function VideoFigure({ video }: { video: Video }) {
  return (
    <figure className="min-w-0">
      <BrowserFrame url={video.chrome}>
        <div className="relative aspect-video bg-panel-2">
          {video.kind === "loom" ? (
            <iframe
              src={`https://www.loom.com/embed/${video.src}?hideEmbedTopBar=true`}
              title={video.title}
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 size-full border-0"
            />
          ) : (
            <video
              controls
              preload="metadata"
              playsInline
              className="absolute inset-0 size-full object-cover"
            >
              <source src={video.src} type="video/mp4" />
              {video.title}
            </video>
          )}
        </div>
      </BrowserFrame>

      {video.caption && (
        <figcaption className="mt-3 text-[13px] leading-relaxed text-text-faint">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}
