import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} · ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0c0b",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#7a8880",
            fontSize: 22,
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 40, height: 2, background: "#8fae37" }} />
          {profile.role}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ color: "#e8ece9", fontSize: 76, lineHeight: 1.05 }}>
            {profile.name}
          </div>
          <div style={{ color: "#9aa39d", fontSize: 30, lineHeight: 1.4, maxWidth: 900 }}>
            {profile.headline}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, background: "#c6f24e" }} />
          <div style={{ color: "#7a8880", fontSize: 24 }}>{profile.availability}</div>
        </div>
      </div>
    ),
    size,
  );
}
