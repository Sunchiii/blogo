import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Blogo";
  const description = searchParams.get("description") || "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          backgroundColor: "#09090b",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: "20px",
            color: "#71717a",
            marginBottom: "16px",
            fontFamily: "sans-serif",
          }}
        >
          Blogo
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: "bold",
            color: "#fafafa",
            lineHeight: 1.2,
            maxWidth: "900px",
            fontFamily: "sans-serif",
            marginBottom: "16px",
          }}
        >
          {title}
        </div>
        {description && (
          <div
            style={{
              fontSize: "24px",
              color: "#a1a1aa",
              maxWidth: "800px",
              fontFamily: "sans-serif",
              lineHeight: 1.4,
            }}
          >
            {description}
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
