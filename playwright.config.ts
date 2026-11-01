import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

// Configure BDD features and step definitions
const testDir = defineBddConfig({
  features: ['features/**/*.feature'],
  steps: ['steps/**/*.ts'],
  outputDir: '.features-gen',
});

export default defineConfig({
  testDir,
  // 60 s per test – CI runners are slower than local machines
  timeout: 60_000,
  // 15 s for every expect() assertion
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Single worker in CI to avoid resource contention; unlimited locally
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { open: 'never' }],
    ['list'],
    [
      './packages/pulse-playwright-reporter/index.mjs',
      {
        endpoint: 'http://localhost:1420/__playwright_api/ingest',
        repository: 'mnashed13/Playwright-BDD-test-framework',
      },
    ],
  ],
  use: {
    baseURL: 'https://demoqa.com',
    // Increase navigation timeout for slow CI network
    navigationTimeout: 30_000,
    actionTimeout: 15_000,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
