// @ts-check
import { defineConfig, devices } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  use: {
    ...devices['Desktop Chrome'],
    baseURL: 'https://example.com', // default fallback, overridden per project
  },

  projects: [
    {
      name: 'todo',
      testDir: 'tests/odin-todo',
      use: {
        baseURL:
          'https://petromirkolev.github.io/js-foundations-projects/projects/odin-todo/',
      },
    },
    {
      name: 'weather',
      testDir: 'tests/odin-weather',
      use: {
        baseURL:
          'https://petromirkolev.github.io/js-foundations-projects/projects/odin-weather/',
      },
    },
    {
      name: 'registration form',
      testDir: 'tests/registration-form',
      use: {
        baseURL: 'https://petromirk30.sg-host.com/',
      },
    },
  ],
});
