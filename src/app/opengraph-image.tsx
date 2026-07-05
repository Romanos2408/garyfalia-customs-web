import { ImageResponse } from "next/og";

export const alt =
  "Garyfalia Customs — hand-painted custom sneakers & denim jackets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Branded share card, generated at build/request time (no static asset needed).
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
          background: "#F5F3EE",
          color: "#0E1B2A",
          padding: "72px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            fontSize: 26,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#16263F",
          }}
        >
          <div style={{ width: 48, height: 2, background: "#16263F" }} />
          Garyfalia Customs
        </div>

        <div
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 96,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
            }}
          >
            <div style={{ display: "flex" }}>Wearable art,</div>
            <div style={{ display: "flex" }}>made by hand.</div>
          </div>
          <div
            style={{
              fontFamily: "Helvetica, Arial, sans-serif",
              fontSize: 30,
              color: "#5b6573",
            }}
          >
            Hand-painted custom sneakers &amp; denim jackets — one of one.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
