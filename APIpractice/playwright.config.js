// @ts-check
const { defineConfig, devices } = require('@playwright/test');

/**
 * @see https://playwright.dev/docs/test-configuration
 */

module.exports = defineConfig({
  testDir: './tests',
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  // forbidOnly: !!process.env.CI,
  
  // /* Retry on CI only */
  // retries: process.env.CI ? 2 : 0,
  
  // /* Opt out of parallel tests on CI. */
  // workers: process.env.CI ? 1 : undefined,
  
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { outputFolder: 'test-results/html-report' }],
    ['junit', { outputFile: 'test-results/junit-report.xml' }],
    ['json', { outputFile: 'test-results/test-results.json' }]
  ],
  
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://stage_ketamin.uat.provider.ecarehealth.com/',
    
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Global timeout for each action */
    actionTimeout: 30000,
    
    /* Global timeout for navigation */
    navigationTimeout: 60000,
    
    /* Ignore HTTPS errors */
    ignoreHTTPSErrors: true,
    
    /* Viewport settings */
    viewport: { width: 1920, height: 1080 },
    
    /* Additional context options */
    acceptDownloads: true,
    
    /* Locale settings */
    locale: 'en-US',
    timezoneId: 'America/New_York',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://127.0.0.1:3000',
  //   reuseExistingServer: !process.env.CI,
  // },

  /* Global setup and teardown */
  // globalSetup: require.resolve('./tests/global-setup.js'),
  // globalTeardown: require.resolve('./tests/global-teardown.js'),
  
  /* Test output directories */
  outputDir: 'test-results/artifacts',
  
  /* Test timeout */
  timeout: 1200000,
  
  /* Expect timeout */
  expect: {
    timeout: 150000
  },

  /* Maximum failures */
  //maxFailures: process.env.CI ? 10 : undefined,
});
const CONFIG = {
  baseURL: 'https://stage_aithinkitive.uat.provider.ecarehealth.com', // Replace with your actual API base URL
  username: 'rose.gomez@jourrapide.com',       // Replace with your actual username
  password: 'Pass@123',                        // Replace with your actual password
  tenant: 'stage_aithinkitive'                 // Replace with your actual tenant ID
};

export default CONFIG;