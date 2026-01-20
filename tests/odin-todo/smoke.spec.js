import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto(
    'https://petromirkolev.github.io/js-foundations-projects/projects/odin-todo/src/index.html',
  );
});

test('Add a book', async ({ page }) => {
  await page.locator('[data-input="new-todo"]').fill('Book');
  await page.locator('[data-action="add-todo"]').click();
  await expect(page.getByText('Book', { exact: true })).toBeVisible();
});

test('Delete a task', async ({ page }) => {
  await page.locator('[data-input="new-todo"]').fill('Walk the dog');
  await page.locator('[data-action="add-todo"]').click();
  await page.locator('[data-input="new-todo"]').fill('Walk the cat');
  await page.locator('[data-action="add-todo"]').click();
  await expect(page.getByText('Walk the dog', { exact: true })).toBeVisible();
  await expect(page.getByText('Walk the cat', { exact: true })).toBeVisible();
  await page
    .locator('.todo-item', { hasText: 'Walk the dog' })
    .getByText('delete')
    .click();
  await expect(page.getByText('Walk the dog', { exact: true })).toBeHidden();
});

test('Add seed sample data', async ({ page }) => {
  await page.locator('[data-action="seed"]').click();
  await expect(page.locator('.todo-item')).toHaveCount(3);
});

test('Mark task as completed', async ({ page }) => {
  await page.locator('[data-action="seed"]').click();
  await page.locator('[data-action="toggle-completed"]').first().click();
  await expect(page.locator('.todo-item').first()).toContainClass('completed');
});

test('Sort and search', async ({ page }) => {
  const addTodo = async (title) => {
    await page.locator('[data-input="new-todo"]').fill(title);
    await page.locator('[data-action="add-todo"]').click();
    await expect(page.locator('.todo-text', { hasText: title })).toBeVisible();
  };

  const getVisibleTitles = async () => {
    const titles = await page.locator('.todo-text').allTextContents();
    return titles.map((t) => t.trim());
  };

  await addTodo('Charlie');
  await addTodo('Alpha');
  await addTodo('Bravo');
  await page.locator('[data-input="sort"]').selectOption({ value: 'textAsc' });
  await expect.poll(getVisibleTitles).toEqual(['Alpha', 'Bravo', 'Charlie']);
  await page.locator('[data-input="search"]').fill('br');
  await expect.poll(getVisibleTitles).toEqual(['Bravo']);
  await page.locator('[data-input="search"]').fill('');
  await expect.poll(getVisibleTitles).toEqual(['Alpha', 'Bravo', 'Charlie']);
});
