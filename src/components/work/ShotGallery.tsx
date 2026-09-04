import type { Shot } from "@/data/types";
import { ShotFigure } from "./ShotFigure";

/**
 * Desktop shots run full measure. Consecutive mobile shots pair up, because a
 * lone 390x844 image at full width is a column of dead space.
 */
export function ShotGallery({
  shots,
  sizes,
}: {
  shots: Shot[];
  sizes?: string;
}) {
  if (shots.length === 0) return null;

  const desktop = shots.filter((s) => s.device === "desktop");
  const mobile = shots.filter((s) => s.device === "mobile");

  return (
    <div className="space-y-10">
      {desktop.map((shot, i) => (
        <ShotFigure key={`d-${i}`} shot={shot} sizes={sizes} />
      ))}

      {mobile.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mobile.map((shot, i) => (
            <ShotFigure
              key={`m-${i}`}
              shot={shot}
              sizes="(max-width: 640px) 100vw, 320px"
            />
          ))}
        </div>
      )}
    </div>
  );
}
