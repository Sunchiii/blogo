const GITHUB_API = "https://api.github.com";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO!;
const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";

async function getFileSHA(path: string, token: string): Promise<string | null> {
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error ${res.status}: ${JSON.stringify(err)}`);
  }
  const data = await res.json();
  return data.sha as string;
}

export async function publishFile(
  path: string,
  content: string,
  message: string,
  token: string
): Promise<void> {
  const sha = await getFileSHA(path, token);
  // btoa with unescape(encodeURIComponent()) handles Unicode characters
  const encoded = btoa(unescape(encodeURIComponent(content)));

  const body: Record<string, string> = {
    message,
    content: encoded,
    branch: BRANCH,
  };
  if (sha) body.sha = sha;

  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub API error ${res.status}: ${JSON.stringify(err)}`);
  }
}

export async function deleteFile(
  path: string,
  message: string,
  token: string
): Promise<void> {
  const sha = await getFileSHA(path, token);
  if (!sha) return; // File doesn't exist

  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/vnd.github+json",
    },
    body: JSON.stringify({ message, sha, branch: BRANCH }),
  });

  if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
}

export async function checkUserPermission(token: string): Promise<string> {
  // First get the authenticated user's login
  const userRes = await fetch(`${GITHUB_API}/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  
  if (!userRes.ok) throw new Error("Failed to fetch user info");
  const userData = await userRes.json();
  const username = userData.login;

  // Then check their permission on the repo
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/collaborators/${username}/permission`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });

  if (!res.ok) {
    if (res.status === 404 || res.status === 403) return "none";
    throw new Error(`GitHub API error: ${res.status}`);
  }

  const data = await res.json();
  return data.permission; // admin, write, read, or none
}

export function isUserWhitelisted(username: string): boolean {
  const allowed = process.env.NEXT_PUBLIC_ALLOWED_USERS;
  if (!allowed) return true; // If not set, allow everyone (default behavior)
  const users = allowed.split(",").map((u) => u.trim().toLowerCase());
  return users.includes(username.toLowerCase());
}
