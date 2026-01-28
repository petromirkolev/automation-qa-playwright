import { test as base, expect } from '@playwright/test';
import { ToDo } from './page-objects/ToDo.js';

export const test = base.extend({
  todo: async ({ page }, use) => {
    await use(new ToDo(page));
  },

  gotoFresh: async ({ page }, use) => {
    await use(async (url = './') => {
      await page.goto(url);
      await page.evaluate(() => localStorage.clear());
      await page.reload();
    });
  },
});

export { expect };
