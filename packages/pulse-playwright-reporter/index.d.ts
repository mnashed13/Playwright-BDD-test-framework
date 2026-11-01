export function resolveIngestUrl(endpoint?: string, env?: NodeJS.ProcessEnv): string;
export function detectGitRepoSlug(cwd?: string): string;
export function resolveRepoSlug(
  options?: {
    repository?: string;
    repo?: string;
    repoSlug?: string;
    repositoryName?: string;
  },
  env?: NodeJS.ProcessEnv,
  cwd?: string
): string;
export function detectCiContext(
  env?: NodeJS.ProcessEnv,
  explicitProvider?: string
): Record<string, string>;
export function publishIngestionPayload(
  payload: Record<string, unknown>,
  options?: { endpoint?: string; apiKey?: string; token?: string; maxRetries?: number }
): Promise<{ ok: boolean; attempt?: number; endpoint: string; response?: unknown; error?: string }>;
