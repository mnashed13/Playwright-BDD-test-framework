# BrowserStack Pulse Playwright reporter

Copy this folder into any Playwright repo as `packages/pulse-playwright-reporter/`, then add it to `playwright.config.ts`. Pulse must be running (`npm run dev` on port **1420**, or `npm run start:hub` on **4173**).

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: [
    ['list'],
    [
      './packages/pulse-playwright-reporter/index.mjs',
      {
        // Hub origin OR the full ingest URL. Both work.
        endpoint: 'http://localhost:1420/__playwright_api/ingest',
        repository: 'org/my-repo',
        // apiKey: process.env.PULSE_API_KEY,
      },
    ],
  ],
});
```

`repository`, `repo`, `repoSlug`, and `repositoryName` are the same option. If you omit it, the reporter uses `PULSE_REPO_SLUG`, then `git remote origin`.

CI (Buildkite, Azure DevOps, GitHub Actions, GitLab) is detected from the agent environment. Point `endpoint` / `PULSE_HUB_URL` at the hub the agents can reach, not `localhost`, unless the hub runs on that agent.
