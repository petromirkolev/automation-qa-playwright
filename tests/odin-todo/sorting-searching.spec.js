import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test.describe('Sorting and searching functions test suite', () => {
  const addTodo = async (page, title) => {
    await page.locator('[data-input="new-todo"]').fill(title);
    await page.locator('[data-action="add-todo"]').click();

    await expect(page.locator('.todo-text', { hasText: title })).toBeVisible();
  };

  const todoRow = (page, title) =>
    page.locator('.todo-item', {
      has: page.locator('.todo-text', { hasText: title }),
    });

  const getVisibleTitles = async (page) =>
    (await page.locator('.todo-text').allTextContents()).map((t) => t.trim());

  test('Search for a specific task', async ({ page }) => {
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');

    await page.locator('[data-input="search"]').fill('beer');

    await expect(todoRow(page, 'Get beer')).toBeVisible();
    await expect(todoRow(page, 'Get milk')).toHaveCount(0);
    await expect(todoRow(page, 'Get water')).toHaveCount(0);
  });

  test('Search for a non-existing task', async ({ page }) => {
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Get beer');
    await addTodo(page, 'Get water');

    await page.locator('[data-input="search"]').fill('candy');

    await expect(todoRow(page, 'Get milk')).toHaveCount(0);
    await expect(todoRow(page, 'Get beer')).toHaveCount(0);
    await expect(todoRow(page, 'Get water')).toHaveCount(0);
    await expect(page.locator('[data-view="empty"]')).toHaveText(
      'No matching tasks',
    );
  });

  test('Completed task remains completed after sorting', async ({ page }) => {
    await addTodo(page, 'Zebra');
    await addTodo(page, 'Alpha');
    await addTodo(page, 'Milk');

    await todoRow(page, 'Zebra')
      .locator('[data-action="toggle-completed"]')
      .click();

    await page
      .locator('[data-input="sort"]')
      .selectOption({ value: 'textAsc' });

    await expect(todoRow(page, 'Zebra')).toHaveClass(/completed/);
  });

  test('Sort persists after clearing search', async ({ page }) => {
    await addTodo(page, 'Get milk');
    await addTodo(page, 'Ask for beer');
    await addTodo(page, 'Wet water');

    await page
      .locator('[data-input="sort"]')
      .selectOption({ value: 'textAsc' });

    await page.locator('[data-input="search"]').fill('candy');
    await page.locator('[data-input="search"]').fill('');

    await expect
      .poll(() => getVisibleTitles(page))
      .toEqual(['Ask for beer', 'Get milk', 'Wet water']);

    await page
      .locator('[data-input="sort"]')
      .selectOption({ value: 'textDesc' });

    await page.locator('[data-input="search"]').fill('candy');
    await page.locator('[data-input="search"]').fill('');

    await expect
      .poll(() => getVisibleTitles(page))
      .toEqual(['Wet water', 'Get milk', 'Ask for beer']);
  });

  test('Sort tasks A-Z', async ({ page }) => {
    await addTodo(page, 'A');
    await addTodo(page, 'G');
    await addTodo(page, 'W');

    await page
      .locator('[data-input="sort"]')
      .selectOption({ value: 'textAsc' });

    await expect.poll(() => getVisibleTitles(page)).toEqual(['A', 'G', 'W']);
  });

  test('Sort tasks Z-A', async ({ page }) => {
    await addTodo(page, 'A');
    await addTodo(page, 'G');
    await addTodo(page, 'W');

    await page
      .locator('[data-input="sort"]')
      .selectOption({ value: 'textDesc' });

    await expect.poll(() => getVisibleTitles(page)).toEqual(['W', 'G', 'A']);
  });

  test('Sort tasks by newest', async ({ page }) => {
    await addTodo(page, '1');
    await addTodo(page, '2');
    await addTodo(page, '3');

    await page
      .locator('[data-input="sort"]')
      .selectOption({ value: 'createdDesc' });

    await expect.poll(() => getVisibleTitles(page)).toEqual(['3', '2', '1']);
  });

  test('Sort tasks by oldest', async ({ page }) => {
    await addTodo(page, '1');
    await addTodo(page, '2');
    await addTodo(page, '3');

    await page
      .locator('[data-input="sort"]')
      .selectOption({ value: 'createdAsc' });

    await expect.poll(() => getVisibleTitles(page)).toEqual(['1', '2', '3']);
  });
});
