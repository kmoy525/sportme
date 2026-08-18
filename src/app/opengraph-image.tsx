import { ImageResponse } from "next/og";

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
          alignItems: "center",
          justifyContent: "center",
          background: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 88,
              height: 88,
              borderRadius: 20,
              background: "#ff4754",
            }}
          >
            <svg width="52" height="52" viewBox="0 0 24 24" fill="white">
              <path d="M13.6 1.5 4 13.4h6.1L9.9 22.5l9.9-12.2h-6.4l.2-8.8Z" />
            </svg>
          </div>
          <span style={{ fontSize: 80, fontWeight: 800, color: "#262626" }}>SportMe</span>
        </div>
        <span style={{ marginTop: 28, fontSize: 34, color: "#262626", opacity: 0.7 }}>
          Workouts are better together
        </span>
      </div>
    ),
    { ...size },
  );
}
