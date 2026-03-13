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
          backgroundColor: "#be123c",
          borderRadius: 36,
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Desk surface */}
          <rect x="16" y="50" width="88" height="6" rx="3" fill="white" opacity="0.95" />
          {/* Left leg */}
          <rect x="22" y="56" width="5" height="30" rx="2" fill="white" opacity="0.7" />
          {/* Right leg */}
          <rect x="93" y="56" width="5" height="30" rx="2" fill="white" opacity="0.7" />
          {/* Chair back */}
          <rect x="42" y="18" width="22" height="26" rx="5" fill="white" opacity="0.85" />
          {/* Chair seat */}
          <rect x="39" y="42" width="28" height="5" rx="2" fill="white" opacity="0.75" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
