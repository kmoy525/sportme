import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <svg width="19" height="19" viewBox="0 0 24 24" fill="white">
          <path d="M13.6 1.5 4 13.4h6.1L9.9 22.5l9.9-12.2h-6.4l.2-8.8Z" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
