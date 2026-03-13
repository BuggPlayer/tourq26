import { ImageResponse } from "next/og";

export const alt = "Torq Studio | Your Trusted Technology Partner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c0f17 0%, #151b28 50%, #0c0f17 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <span style={{ fontSize: 48, fontWeight: 800, color: "#fff" }}>
            torq
          </span>
          <span style={{ fontSize: 48, fontWeight: 800, color: "#6366f1" }}>
            studio
          </span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#94a3b8",
            maxWidth: 640,
            textAlign: "center",
            lineHeight: 1.4,
          }}
          >
          Your trusted technology partner. Mobile, web, AI & remote IT — globally.
        </div>
      </div>
    ),
    { ...size }
  );
}
