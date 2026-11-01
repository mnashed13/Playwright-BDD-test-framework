import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const INGEST_PATH = '/__playwright_api/ingest';

/**
 * Hub base (`http://localhost:1420`) or the full ingest URL both work.
 * The copy-paste snippet in Pulse uses the full ingest URL.
 */
export function resolveIngestUrl(endpoint, env = process.env) {
  let raw = String(endpoint || env.PULSE_HUB_URL || 'http://localhost:1420').trim();
  raw = raw.replace(/\/+$/, '');
  if (/\/__playwright_api\/ingest$/i.test(raw)) return raw;
  return `${raw}${INGEST_PATH}`;
}

/** org/repo from git remote origin, when the config omits a repository name. */
export function detectGitRepoSlug(cwd = process.cwd()) {
  try {
    const url = execFileSync('git', ['config', '--get', 'remote.origin.url'], {
      cwd,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    const cleaned = url.replace(/\.git$/i, '').replace(/\/+$/, '');
    const match = cleaned.match(/[:/]([^/:]+\/[^/]+)$/);
    return match ? match[1] : '';
  } catch {
    return '';
  }
}

/**
 * Accepts the option names people actually paste:
 * repository, repo, repoSlug, repositoryName, plus PULSE_REPO_SLUG and git origin.
 */
export function resolveRepoSlug(options = {}, env = process.env, cwd = process.cwd()) {
  const explicit =
    options.repository ||
    options.repo ||
    options.repoSlug ||
    options.repositoryName ||
    env.PULSE_REPO_SLUG ||
    '';
  const trimmed = String(explicit).trim();
  if (trimmed) return trimmed;
  return detectGitRepoSlug(cwd) || 'local/playwright';
}

export function detectCiContext(env = process.env, explicitProvider = 'auto') {
  const provider =
    explicitProvider && explicitProvider !== 'auto'
      ? explicitProvider
      : env.TF_BUILD === 'True' || env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI
      ? 'azure-devops'
      : env.BUILDKITE === 'true' || env.BUILDKITE_BUILD_ID
      ? 'buildkite'
      : env.GITHUB_ACTIONS === 'true'
      ? 'github-actions'
      : env.GITLAB_CI === 'true'
      ? 'gitlab-ci'
      : 'local';

  if (provider === 'azure-devops') {
    const collectionUri = (env.SYSTEM_TEAMFOUNDATIONCOLLECTIONURI || 'https://dev.azure.com/acme-org/').replace(/\/$/, '');
    const teamProject = env.SYSTEM_TEAMPROJECT || 'acme-project';
    const buildId = env.BUILD_BUILDID || '1001';
    const rawBranch = env.BUILD_SOURCEBRANCH || env.BUILD_SOURCEBRANCHNAME || 'main';
    return {
      ciProvider: 'azure-devops',
      pipelineName: env.BUILD_DEFINITIONNAME || 'Azure DevOps Playwright Pipeline',
      pipelineId: env.SYSTEM_DEFINITIONID || String(buildId),
      buildNumber: env.BUILD_BUILDNUMBER || `#${buildId}`,
      buildUrl: `${collectionUri}/${teamProject}/_build/results?buildId=${buildId}&view=results`,
      branch: rawBranch.replace(/^refs\/heads\//, ''),
      commitSha: (env.BUILD_SOURCEVERSION || 'unknown').slice(0, 12),
      commitMessage: env.BUILD_SOURCEVERSIONMESSAGE || 'Azure DevOps pipeline execution',
      commitAuthor: env.BUILD_REQUESTEDFOREMAIL || env.BUILD_REQUESTEDFOR || 'azdo-pipeline@local',
      triggeredBy: env.BUILD_REASON || 'CI Trigger',
      environment: env.PULSE_TEST_ENV || env.SYSTEM_STAGENAME || 'staging',
    };
  }

  if (provider === 'buildkite') {
    const buildNum = env.BUILDKITE_BUILD_NUMBER || '100';
    const slug = env.BUILDKITE_PIPELINE_SLUG || 'pipeline';
    return {
      ciProvider: 'buildkite',
      pipelineName: env.BUILDKITE_PIPELINE_NAME || slug,
      pipelineId: env.BUILDKITE_PIPELINE_ID || env.BUILDKITE_BUILD_ID || `bk-${buildNum}`,
      buildNumber: `#${buildNum}`,
      buildUrl: env.BUILDKITE_BUILD_URL || `https://buildkite.com/${env.BUILDKITE_ORGANIZATION_SLUG || 'org'}/${slug}/builds/${buildNum}`,
      branch: env.BUILDKITE_BRANCH || 'main',
      commitSha: (env.BUILDKITE_COMMIT || 'unknown').slice(0, 12),
      commitMessage: env.BUILDKITE_MESSAGE || 'Buildkite agent execution',
      commitAuthor: env.BUILDKITE_BUILD_CREATOR_EMAIL || env.BUILDKITE_BUILD_CREATOR || 'buildkite-agent@local',
      triggeredBy: env.BUILDKITE_SOURCE || 'Buildkite',
      environment: env.PULSE_TEST_ENV || 'staging',
    };
  }

  if (provider === 'github-actions') {
    const repo = env.GITHUB_REPOSITORY || 'org/repo';
    const runId = env.GITHUB_RUN_ID || '0';
    const server = (env.GITHUB_SERVER_URL || 'https://github.com').replace(/\/$/, '');
    return {
      ciProvider: 'github-actions',
      pipelineName: env.GITHUB_WORKFLOW || 'GitHub Actions',
      pipelineId: String(runId),
      buildNumber: env.GITHUB_RUN_NUMBER ? `#${env.GITHUB_RUN_NUMBER}` : `#${runId}`,
      buildUrl: `${server}/${repo}/actions/runs/${runId}`,
      branch: env.GITHUB_HEAD_REF || env.GITHUB_REF_NAME || 'main',
      commitSha: (env.GITHUB_SHA || 'unknown').slice(0, 12),
      commitMessage: env.PULSE_GIT_MESSAGE || 'GitHub Actions run',
      commitAuthor: env.GITHUB_ACTOR || 'github-actions',
      triggeredBy: env.GITHUB_EVENT_NAME || 'GitHub Actions',
      environment: env.PULSE_TEST_ENV || 'ci',
    };
  }

  if (provider === 'gitlab-ci') {
    return {
      ciProvider: 'gitlab-ci',
      pipelineName: env.CI_PIPELINE_NAME || env.CI_PROJECT_NAME || 'GitLab CI',
      pipelineId: String(env.CI_PIPELINE_ID || env.CI_JOB_ID || 'gitlab'),
      buildNumber: env.CI_PIPELINE_IID ? `#${env.CI_PIPELINE_IID}` : String(env.CI_JOB_ID || 'gitlab'),
      buildUrl: env.CI_PIPELINE_URL || env.CI_JOB_URL || 'https://gitlab.com',
      branch: env.CI_COMMIT_REF_NAME || 'main',
      commitSha: (env.CI_COMMIT_SHA || 'unknown').slice(0, 12),
      commitMessage: env.CI_COMMIT_MESSAGE || 'GitLab CI run',
      commitAuthor: env.GITLAB_USER_EMAIL || env.GITLAB_USER_LOGIN || 'gitlab-ci',
      triggeredBy: env.CI_PIPELINE_SOURCE || 'GitLab CI',
      environment: env.PULSE_TEST_ENV || 'ci',
    };
  }

  const hostname = os.hostname() || 'workstation';
  const tsShort = String(Date.now()).slice(-6);
  return {
    ciProvider: 'local',
    pipelineName: env.PULSE_PIPELINE_NAME || 'Local Playwright CLI',
    pipelineId: `local-${hostname}-${tsShort}`,
    buildNumber: env.PULSE_BUILD_NUMBER || `local-${tsShort}`,
    buildUrl: env.PULSE_BUILD_URL || 'http://localhost:1420',
    branch: env.PULSE_GIT_BRANCH || env.GIT_BRANCH || 'main',
    commitSha: (env.PULSE_GIT_SHA || env.GIT_COMMIT || crypto.randomBytes(6).toString('hex')).slice(0, 12),
    commitMessage: env.PULSE_GIT_MESSAGE || 'Local Playwright execution',
    commitAuthor: env.USER || env.USERNAME || 'local',
    triggeredBy: 'Local CLI (`npx playwright test`)',
    environment: env.PULSE_TEST_ENV || 'local',
  };
}

export async function publishIngestionPayload(payload, options = {}) {
  const url = resolveIngestUrl(options.endpoint);
  const apiKey = options.apiKey || options.token || process.env.PULSE_API_KEY || '';
  const maxRetries = options.maxRetries ?? 3;

  let lastError = null;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(apiKey ? { Authorization: `Bearer ${apiKey}`, 'X-Pulse-Api-Key': apiKey } : {}),
          ...(payload.idempotencyKey ? { 'X-Idempotency-Key': payload.idempotencyKey } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status}: ${text || response.statusText}`);
      }

      const data = await response.json();
      return { ok: true, attempt, endpoint: url, response: data };
    } catch (err) {
      lastError = err;
      if (attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, 250 * 2 ** (attempt - 1)));
      }
    }
  }

  return {
    ok: false,
    endpoint: url,
    error: lastError instanceof Error ? lastError.message : String(lastError),
  };
}

function chunkText(chunk) {
  if (typeof chunk === 'string') return chunk;
  if (Buffer.isBuffer(chunk)) return chunk.toString('utf8');
  if (chunk && typeof chunk === 'object') {
    if (typeof chunk.text === 'string') return chunk.text;
    if (Buffer.isBuffer(chunk.buffer)) return chunk.buffer.toString('utf8');
    if (chunk.buffer instanceof Uint8Array) return Buffer.from(chunk.buffer).toString('utf8');
  }
  return '';
}

function projectNameOf(test) {
  let node = test;
  for (let depth = 0; node && depth < 12; depth += 1) {
    if (typeof node.project === 'function') {
      try {
        const name = node.project()?.name;
        if (name) return name;
      } catch {
        // suite without a project
      }
    }
    node = node.parent;
  }
  return '';
}

function suiteTitleOf(test) {
  const titles = [];
  let node = test.parent;
  const projectName = projectNameOf(test);
  for (let depth = 0; node && depth < 12; depth += 1) {
    if (node.title && node.title !== projectName) titles.unshift(node.title);
    node = node.parent;
  }
  return titles.filter(Boolean).join(' > ') || 'Playwright Suite';
}

function browserOf(projectTitle) {
  const name = String(projectTitle || '').toLowerCase();
  if (name.includes('firefox')) return 'firefox';
  if (name.includes('webkit') || name.includes('safari')) return 'webkit';
  if (name.includes('mobile chrome')) return 'Mobile Chrome';
  if (name.includes('mobile safari')) return 'Mobile Safari';
  return 'chromium';
}

function readTraceZip(result) {
  const attachment = (result.attachments || []).find(
    (item) =>
      item.name === 'trace' ||
      item.contentType === 'application/zip' ||
      (item.path && String(item.path).endsWith('.zip'))
  );
  if (!attachment) return undefined;
  try {
    if (attachment.path && fs.existsSync(attachment.path)) {
      return fs.readFileSync(attachment.path).toString('base64');
    }
    if (attachment.body) {
      const body = Buffer.isBuffer(attachment.body) ? attachment.body : Buffer.from(attachment.body);
      if (body.length) return body.toString('base64');
    }
  } catch {
    return undefined;
  }
  return undefined;
}

/**
 * Drop-in Playwright reporter. Copy `packages/pulse-playwright-reporter/` into any repo:
 *
 * ```ts
 * reporter: [
 *   ['./packages/pulse-playwright-reporter/index.mjs', {
 *     endpoint: 'http://localhost:1420/__playwright_api/ingest',
 *     repository: 'org/my-repo',
 *   }],
 * ]
 * ```
 *
 * `endpoint` may be the hub origin or the full ingest URL.
 * `repository` / `repo` / `repoSlug` are equivalent. Omitted → git origin, then PULSE_REPO_SLUG.
 */
export default class PulsePlaywrightReporter {
  constructor(options = {}) {
    this.options = options;
    this.tests = [];
    this.startTime = Date.now();
  }

  onBegin(_config, suite) {
    this.startTime = Date.now();
    this.totalTests = suite?.allTests ? suite.allTests().length : 0;
  }

  onTestEnd(test, result) {
    const projectTitle = projectNameOf(test) || this.options.projectName || 'chromium';
    const statusMap = {
      passed: 'passed',
      failed: 'failed',
      timedOut: 'timedOut',
      skipped: 'skipped',
      interrupted: 'failed',
    };
    const errorMessage = result.error?.message || '';
    const errorSummary = errorMessage ? errorMessage.split('\n')[0] : undefined;
    const specFile = test.location?.file
      ? path.relative(process.cwd(), test.location.file).replace(/\\/g, '/')
      : 'tests/spec.ts';

    this.tests.push({
      suiteName: suiteTitleOf(test),
      testName: test.title,
      testTitle: test.title,
      specFile,
      line: test.location?.line || 1,
      status: statusMap[result.status] || 'failed',
      flaky: result.status === 'passed' && (result.retry || 0) > 0,
      retryCount: result.retry || 0,
      maxRetries: test.retries || 0,
      browser: browserOf(projectTitle),
      os: `${os.platform()} ${os.release()}`,
      viewport: '1440x900',
      workerIndex: result.workerIndex ?? 0,
      durationMs: result.duration || 0,
      failureSummary: errorSummary,
      errorSummary,
      errorMessage: errorMessage || undefined,
      errorStack: result.error?.stack,
      steps: (result.steps || []).map((step, idx) => {
        const categoryRaw = String(step.category || '');
        const category = categoryRaw === 'hook'
          ? 'hook'
          : categoryRaw.includes('expect') || categoryRaw === 'assert'
          ? 'assertion'
          : categoryRaw.includes('locator')
          ? 'locator'
          : /goto|navigate/.test(step.title || '')
          ? 'navigation'
          : 'page';
        return {
          id: `step-${idx + 1}`,
          callId: `call-${idx + 1}`,
          title: step.title || `Step ${idx + 1}`,
          apiName: step.title || categoryRaw || 'step',
          category,
          startTimeMs: 0,
          startTimeOffsetMs: 0,
          durationMs: step.duration || 0,
          status: step.error ? 'failed' : 'passed',
          sourceFile: step.location?.file,
          sourceLine: step.location?.line,
          error: step.error?.message,
        };
      }),
      consoleLogs: [...(result.stdout || []), ...(result.stderr || [])]
        .map((chunk, i) => ({
          id: `log-${i}`,
          timestampOffsetMs: i * 50,
          type: 'log',
          text: chunkText(chunk).trim(),
        }))
        .filter((entry) => entry.text),
      traceZipBase64: readTraceZip(result),
    });
  }

  async onEnd() {
    if (!this.tests.length) {
      console.warn('[BrowserStack Pulse] No test results to publish.');
      return;
    }

    const ci = detectCiContext(process.env, this.options.ciProvider || 'auto');
    const repoSlug = resolveRepoSlug(this.options);
    const projectName =
      this.options.projectName || this.options.project || repoSlug.split('/')[1] || repoSlug;
    const idempotencyKey =
      this.options.idempotencyKey ||
      `${repoSlug}:${ci.ciProvider}:${ci.buildNumber}:${ci.commitSha}`;

    const payload = {
      idempotencyKey,
      repoSlug,
      repository: repoSlug,
      repositoryName: repoSlug,
      projectName,
      ciProvider: ci.ciProvider,
      pipelineName: ci.pipelineName,
      pipelineId: ci.pipelineId,
      buildNumber: ci.buildNumber,
      buildId: String(ci.pipelineId || ci.buildNumber),
      buildUrl: ci.buildUrl,
      branch: ci.branch,
      commitSha: ci.commitSha,
      commitMessage: ci.commitMessage,
      commitAuthor: ci.commitAuthor,
      environment: this.options.environment || ci.environment,
      releaseVersion: this.options.releaseVersion || process.env.PULSE_RELEASE_VERSION,
      triggeredBy: ci.triggeredBy,
      startedAt: new Date(this.startTime).toISOString(),
      durationMs: Math.max(1, Date.now() - this.startTime),
      tests: this.tests,
    };

    const endpoint = resolveIngestUrl(this.options.endpoint);
    if (this.options.dryRun) {
      console.log(
        `[BrowserStack Pulse] Dry run: ${this.tests.length} test(s) for ${repoSlug} -> ${endpoint}`
      );
      return;
    }

    console.log(
      `[BrowserStack Pulse] Publishing ${this.tests.length} test(s) for ${repoSlug} -> ${endpoint}`
    );

    const res = await publishIngestionPayload(payload, {
      endpoint: this.options.endpoint,
      apiKey: this.options.apiKey || this.options.token,
    });

    if (res.ok) {
      console.log(
        `[BrowserStack Pulse] Published ${this.tests.length} result(s) (${res.response?.ingestedTests ?? 'ok'} ingested, attempt ${res.attempt}).`
      );
    } else {
      console.error(
        `[BrowserStack Pulse] Failed to publish results to ${res.endpoint}: ${res.error}`
      );
    }
  }
}
