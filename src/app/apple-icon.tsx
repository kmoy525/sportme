import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ff4754",
        }}
      >
        <svg width="104" height="104" viewBox="0 0 24 24" fill="white">
          <path d="M13.6 1.5 4 13.4h6.1L9.9 22.5l9.9-12.2h-6.4l.2-8.8Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
