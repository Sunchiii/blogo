import fs from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const postsDir = path.join(process.cwd(), "posts");
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ saved: false, reason: "Local file sync is development-only." });
  }

  const body = await request.json().catch(() => null);
  const slug = body?.meta?.slug;
  const html = body?.html;

  if (typeof slug !== "string" || !slugPattern.test(slug)) {
    return NextResponse.json({ error: "Invalid post slug." }, { status: 400 });
  }

  if (typeof html !== "string" || !body?.meta || typeof body.meta !== "object") {
    return NextResponse.json({ error: "Invalid post payload." }, { status: 400 });
  }

  await fs.mkdir(postsDir, { recursive: true });
  await fs.writeFile(path.join(postsDir, `${slug}.html`), html, "utf-8");
  await fs.writeFile(
    path.join(postsDir, `${slug}.json`),
    JSON.stringify(body.meta, null, 2),
    "utf-8"
  );

  return NextResponse.json({ saved: true });
}
