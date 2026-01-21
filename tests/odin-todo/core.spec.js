import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Core functions test suite', () => {
  const addTodo = async (page, title) => {
    await page.locator('[data-input="new-todo"]').fill(title);
    await page.locator('[data-action="add-todo"]').click();
    await expect(page.locator('.todo-text', { hasText: title })).toBeVisible();
  };

  const todoRow = (page, title) =>
    page.locator('.todo-item', {
      has: page.locator('.todo-text', { hasText: title }),
    });

  test('Show all tasks', async ({ page }) => {
    const getVisibleTitles = async () => {
      const titles = await page.locator('.todo-text').allTextContents();
      return titles.map((t) => t.trim());
    };
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');
    await page
      .locator('[data-input="filter-status"]')
      .selectOption({ value: 'all' });
    await expect
      .poll(getVisibleTitles)
      .toEqual(['Get water', 'Get beer', 'Get milk']);
  });

  test('Show active tasks', async ({ page }) => {
    const getVisibleTitles = async () => {
      const titles = await page.locator('.todo-text').allTextContents();
      return titles.map((t) => t.trim());
    };
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');
    await todoRow(page, 'Get beer')
      .locator('[data-action="toggle-completed"]')
      .click();
    await page
      .locator('[data-input="filter-status"]')
      .selectOption({ value: 'active' });
    await expect.poll(getVisibleTitles).toEqual(['Get water', 'Get milk']);
  });

  test('Show completed tasks', async ({ page }) => {
    const getVisibleTitles = async () => {
      const titles = await page.locator('.todo-text').allTextContents();
      return titles.map((t) => t.trim());
    };
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');
    await todoRow(page, 'Get beer')
      .locator('[data-action="toggle-completed"]')
      .click();
    await page
      .locator('[data-input="filter-status"]')
      .selectOption({ value: 'completed' });
    await expect.poll(getVisibleTitles).toEqual(['Get beer']);
  });

  test('Clear completed tasks', async ({ page }) => {
    const getVisibleTitles = async () => {
      const titles = await page.locator('.todo-text').allTextContents();
      return titles.map((t) => t.trim());
    };
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');
    await todoRow(page, 'Get beer')
      .locator('[data-action="toggle-completed"]')
      .click();
    await page
      .locator('[data-input="filter-status"]')
      .selectOption({ value: 'all' });
    await page.locator('[data-action="clear-completed"]').click();
    await expect.poll(getVisibleTitles).toEqual(['Get water', 'Get milk']);
  });

  test('Clear all tasks', async ({ page }) => {
    const getVisibleTitles = async () => {
      const titles = await page.locator('.todo-text').allTextContents();
      return titles.map((t) => t.trim());
    };
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');

    await page
      .locator('[data-input="filter-status"]')
      .selectOption({ value: 'all' });
    await page.locator('[data-action="clear-all"]').click();
    await expect.poll(getVisibleTitles).toEqual([]);
  });

  test('Clear search restores tasks list', async ({ page }) => {
    const getVisibleTitles = async () => {
      const titles = await page.locator('.todo-text').allTextContents();
      return titles.map((t) => t.trim());
    };
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');
    await page.locator('[data-input="search"]').fill('be');
    await page.locator('[data-input="search"]').fill('');
    await expect
      .poll(getVisibleTitles)
      .toEqual(['Get water', 'Get beer', 'Get milk']);
  });
});
