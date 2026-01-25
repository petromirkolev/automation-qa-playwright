import { test, expect } from '@playwright/test';

test.describe('Smoke test suite', () => {
  test.beforeEach(({ page }) => {
    page.goto('./');
  });

  test('Load registration form successfully', async ({ page }) => {
    expect('asd').toBe('asd');
  });
});
