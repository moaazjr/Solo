import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0e0d0c",
          color: "#f7f4ef",
          fontFamily: "serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -120,
            top: -160,
            width: 620,
            height: 620,
            borderRadius: 620,
            background: "radial-gradient(circle, rgba(122,46,59,0.75), rgba(122,46,59,0) 70%)",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 44,
              border: "2px solid rgba(247,244,239,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 16, height: 16, borderRadius: 16, background: "#c2566a" }} />
          </div>
          <div style={{ fontSize: 44 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 6, textTransform: "uppercase", color: "#e3a9b4", fontFamily: "monospace" }}>
            A one-human technology company
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.02, marginTop: 24, maxWidth: 980 }}>
            Software, built by one founder and a team of AI agents.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
