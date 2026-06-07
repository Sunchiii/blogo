import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Missing code" }, { status: 400 });
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: "GitHub OAuth not configured" },
      { status: 500 }
    );
  }

  // Exchange code for access token (server-to-server, no CORS issue)
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: `${request.nextUrl.origin}/editor/auth/callback`,
    }),
    cache: "no-store",
  });

  if (!tokenRes.ok) {
    const message = await tokenRes.text().catch(() => "");
    return NextResponse.json(
      { error: `GitHub token exchange failed (${tokenRes.status}). ${message}` },
      { status: 500 }
    );
  }

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
  }

  if (!tokenData.access_token) {
    return NextResponse.json(
      { error: "GitHub did not return an access token." },
      { status: 502 }
    );
  }

  // Fetch GitHub username using the access token
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
  if (!userRes.ok) {
    const message = await userRes.text().catch(() => "");
    return NextResponse.json(
      { error: `GitHub user lookup failed (${userRes.status}). ${message}` },
      { status: 500 }
    );
  }
  const userData = await userRes.json();

  return NextResponse.json({
    access_token: tokenData.access_token,
    username: userData.login || "",
  });
}
