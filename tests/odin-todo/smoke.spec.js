import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test.describe('Smoke test suite', () => {
  const addTodo = async (page, title) => {
    await page.locator('[data-input="new-todo"]').fill(title);
    await page.locator('[data-action="add-todo"]').click();
    await expect(page.locator('.todo-text', { hasText: title })).toBeVisible();
  };

  const todoRow = (page, title) =>
    page.locator('.todo-item', {
      has: page.locator('.todo-text', { hasText: title }),
    });

  test('App is loaded and UI is visible', async ({ page }) => {
    await expect(page.locator('[data-input="new-todo"]')).toBeVisible();
    await expect(page.locator('[data-action="add-todo"]')).toBeVisible();
    await expect(page.locator('.list-wrap')).toBeVisible();
  });

  test('Add a task', async ({ page }) => {
    await addTodo(page, 'Buy a book');
  });

  test('Mark task as completed', async ({ page }) => {
    await addTodo(page, 'Buy a book');

    await todoRow(page, 'Buy a book')
      .locator('[data-action="toggle-completed"]')
      .click();

    await expect(todoRow(page, 'Buy a book')).toHaveClass(/completed/);
  });

  test('Mark task as not completed', async ({ page }) => {
    await addTodo(page, 'Buy a book');

    const row = todoRow(page, 'Buy a book');
    const toggle = row.locator('[data-action="toggle-completed"]');

    await toggle.click();
    await toggle.click();

    await expect(row).not.toHaveClass(/completed/);
  });

  test('Edit task updates text', async ({ page }) => {
    await addTodo(page, 'Buy a book');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Buy a book');
      await dialog.accept('Buy books instead!');
    });

    await todoRow(page, 'Buy a book')
      .locator('[data-action="edit-todo"]')
      .click();

    await expect(todoRow(page, 'Buy books instead!')).toBeVisible();
  });

  test('Delete task removes it', async ({ page }) => {
    await addTodo(page, 'Buy a book');
    await addTodo(page, 'Buy a coffee');

    await todoRow(page, 'Buy a book')
      .locator('[data-action="delete-todo"]')
      .click();

    await expect(todoRow(page, 'Buy a book')).toHaveCount(0);
    await expect(todoRow(page, 'Buy a coffee')).toBeVisible();
  });
});
