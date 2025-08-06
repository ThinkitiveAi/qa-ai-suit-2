import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  /* Maximum time one test can run for. */
  timeout: 120 * 1000,
  /* Expect timeout - time or expectation to pass. */
  expect: {
    timeout: 10 * 1000,
  },
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto()`. */
    // baseURL: 'http://127.0.0.1:3000',

    /* Collect traces upon failing the test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    headless: false, // Ensure headed mode for debugging
  },
}); 