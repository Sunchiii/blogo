const GITHUB_API = "https://api.github.com";
const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO!;
const BRANCH = process.env.NEXT_PUBLIC_GITHUB_BRANCH || "main";

function assertGitHubConfig() {
  if (!REPO) {
    throw new Error("NEXT_PUBLIC_GITHUB_REPO is not configured. Use the format owner/repo.");
  }

  if (REPO.includes("github.com") || REPO.startsWith("http") || REPO.split("/").length !== 2) {
    throw new Error(
      `NEXT_PUBLIC_GITHUB_REPO must use owner/repo format, not "${REPO}". Example: octocat/blogo.`
    );
  }
}

async function parseGitHubError(res: Response) {
  const err = await res.json().catch(() => ({}));
  const message = typeof err.message === "string" ? err.message : res.statusText;
  return `${message} for repo "${REPO}", branch "${BRANCH}". Check that NEXT_PUBLIC_GITHUB_REPO is owner/repo and your GitHub account has write access.`;
}

async function getFileSHA(path: string, token: string): Promise<string | null> {
  assertGitHubConfig();
  const res = await fetch(`${GITHUB_API}/repos/${REPO}/contents/${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub API error ${res.status}: ${await parseGitHubError(res)}`);
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
  assertGitHubConfig();
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
    throw new Error(
      `GitHub API error ${res.status} while publishing "${path}": ${await parseGitHubError(res)}`
    );
  }
}

export async function deleteFile(
  path: string,
  message: string,
  token: string
): Promise<void> {
  assertGitHubConfig();
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

  if (!res.ok) {
    throw new Error(
      `GitHub API error ${res.status} while deleting "${path}": ${await parseGitHubError(res)}`
    );
  }
}
