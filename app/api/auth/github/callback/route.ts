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
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Token exchange failed" }, { status: 500 });
  }

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error_description }, { status: 400 });
  }

  // Fetch GitHub username using the access token
  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/vnd.github+json",
    },
  });
  const userData = userRes.ok ? await userRes.json() : {};

  return NextResponse.json({
    access_token: tokenData.access_token,
    username: userData.login || "",
  });
}
