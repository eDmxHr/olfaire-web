import "server-only";

const API_ROOT = "https://api.github.com";
const DEFAULT_REPO = "eDmxHr/olfaire-web";
const DEFAULT_BRANCH = "main";

function getConfig() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error("GITHUB_TOKEN is not configured.");
  }

  const repo = process.env.GITHUB_REPO || DEFAULT_REPO;
  const [owner, name] = repo.split("/");
  if (!owner || !name) {
    throw new Error(`GITHUB_REPO must be in "owner/repo" form (got "${repo}").`);
  }

  return {
    token,
    owner,
    name,
    branch: process.env.GITHUB_BRANCH || DEFAULT_BRANCH,
  };
}

export function isGitHubPublishingConfigured() {
  return Boolean(process.env.GITHUB_TOKEN);
}

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

function describeFailure(status: number, fallback: string) {
  if (status === 401 || status === 403) {
    return "GitHub authentication failed. Check GITHUB_TOKEN and its repository permissions.";
  }
  if (status === 404) {
    return "GitHub repository or branch was not found.";
  }
  if (status === 409 || status === 422) {
    return "GitHub rejected the commit (branch conflict or invalid content).";
  }
  return fallback;
}

/**
 * Commits a blog post to the repository. Refuses to overwrite an existing
 * file, mirroring the local `flag: "wx"` behaviour.
 */
export async function commitBlogPost(
  slug: string,
  content: string,
  message: string,
): Promise<string> {
  const { token, owner, name, branch } = getConfig();
  const repoPath = `src/content/blog/${slug}.mdx`;
  const url = `${API_ROOT}/repos/${owner}/${name}/contents/${repoPath}`;

  const existing = await fetch(`${url}?ref=${encodeURIComponent(branch)}`, {
    headers: headers(token),
    signal: AbortSignal.timeout(15000),
  });

  if (existing.ok) {
    throw new Error(`A blog article already exists at ${slug}.mdx.`);
  }

  if (existing.status !== 404) {
    throw new Error(
      describeFailure(existing.status, "Unable to reach GitHub."),
    );
  }

  const response = await fetch(url, {
    method: "PUT",
    headers: headers(token),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
    }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    throw new Error(
      describeFailure(response.status, "Unable to commit the article to GitHub."),
    );
  }

  return repoPath;
}
