import { ImageResponse } from "next/og";

export const alt = "Classroom Redesigner — Research-backed classroom layout tool";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
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
          backgroundColor: "#fafaf9",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: "#be123c",
          }}
        />

        {/* Icon */}
        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: 18,
            backgroundColor: "#be123c",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
          }}
        >
          <svg
            width="50"
            height="50"
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect x="16" y="50" width="88" height="6" rx="3" fill="white" opacity="0.95" />
            <rect x="22" y="56" width="5" height="30" rx="2" fill="white" opacity="0.7" />
            <rect x="93" y="56" width="5" height="30" rx="2" fill="white" opacity="0.7" />
            <rect x="42" y="18" width="22" height="26" rx="5" fill="white" opacity="0.85" />
            <rect x="39" y="42" width="28" height="5" rx="2" fill="white" opacity="0.75" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#1c1917",
            marginBottom: 16,
            letterSpacing: "-0.02em",
          }}
        >
          Classroom Redesigner
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#78716c",
            maxWidth: 600,
            textAlign: "center",
            lineHeight: 1.4,
          }}
        >
          Redesign your classroom with research, not guesswork
        </div>

        {/* Bottom pills */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {["AI-Powered", "Research-Backed", "Free"].map((label) => (
            <div
              key={label}
              style={{
                backgroundColor: "#fff1f2",
                color: "#be123c",
                padding: "8px 20px",
                borderRadius: 999,
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
