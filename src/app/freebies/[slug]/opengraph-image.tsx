import { ImageResponse } from "next/og";
import { freebies } from "@/data/freebies";

export const alt = "Free resource";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const freebie = freebies.find((f) => f.slug === slug);
  const title = freebie?.title ?? "Free resource";
  const description = freebie?.description ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 56,
          background: "linear-gradient(145deg, #07090e 0%, #1e1b4b 40%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#fff" }}>torq</span>
          <span style={{ fontSize: 28, fontWeight: 800, color: "#a78bfa" }}>studio</span>
          <span style={{ fontSize: 18, color: "#64748b", marginLeft: 12 }}>Free resource</span>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
          <div
            style={{
              fontSize: title.length > 70 ? 38 : 48,
              fontWeight: 700,
              color: "#f1f5f9",
              lineHeight: 1.15,
              maxHeight: 280,
              overflow: "hidden",
            }}
          >
            {title.length > 160 ? `${title.slice(0, 157)}…` : title}
          </div>
          {description ? (
            <div
              style={{
                fontSize: 20,
                color: "#94a3b8",
                lineHeight: 1.4,
                maxHeight: 100,
                overflow: "hidden",
              }}
            >
              {description.length > 140 ? `${description.slice(0, 137)}…` : description}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size }
  );
}
