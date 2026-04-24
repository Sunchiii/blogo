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

  // Exchange code for access token
  console.log("[Auth] Exchanging code for token...", { clientId, hasSecret: !!clientSecret });
  
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "Blogo-App",
      },
      body: JSON.stringify({ 
        client_id: clientId, 
        client_secret: clientSecret, 
        code 
      }),
    });

    if (!tokenRes.ok) {
      const errorText = await tokenRes.text();
      console.error("[Auth] Token exchange failed:", tokenRes.status, errorText);
      return NextResponse.json({ error: "Token exchange failed", details: errorText }, { status: 500 });
    }

    const tokenData = await tokenRes.json();
    console.log("[Auth] Token response received:", tokenData.error ? "Error: " + tokenData.error : "Success");

    if (tokenData.error) {
      console.error("[Auth] Token data error:", tokenData.error, tokenData.error_description);
      return NextResponse.json({ 
        error: tokenData.error, 
        error_description: tokenData.error_description 
      }, { status: 400 });
    }

    if (!tokenData.access_token) {
      console.error("[Auth] No access token in response:", tokenData);
      return NextResponse.json({ error: "No access token received" }, { status: 500 });
    }

    // Fetch GitHub username using the access token
    console.log("[Auth] Fetching user profile...");
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "Blogo-App",
      },
    });

    if (!userRes.ok) {
      const errorText = await userRes.text();
      console.error("[Auth] Failed to fetch user profile:", userRes.status, errorText);
      return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
    }

    const userData = await userRes.json();
    console.log("[Auth] User profile fetched for:", userData.login);

    return NextResponse.json({
      access_token: tokenData.access_token,
      username: userData.login || "",
    });
  } catch (err: any) {
    console.error("[Auth] Unhandled error during callback:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
