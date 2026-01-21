import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('./');
});

test.describe('Edge cases test suite', () => {
  const addTodo = async (page, title) => {
    await page.locator('[data-input="new-todo"]').fill(title);
    await page.locator('[data-action="add-todo"]').click();

    await expect(page.locator('.todo-text', { hasText: title })).toBeVisible();
  };

  const todoRow = (page, title) =>
    page.locator('.todo-item', {
      has: page.locator('.todo-text', { hasText: title }),
    });

  test('Add task by Enter key', async ({ page }) => {
    await page.locator('[data-input="new-todo"]').fill('Get money');
    await page.locator('[data-input="new-todo"]').press('Enter');

    await expect(todoRow(page, 'Get money')).toBeVisible();
  });

  test('Reject adding an empty task', async ({ page }) => {
    await page.locator('[data-input="new-todo"]').fill('  ');
    await page.locator('[data-action="add-todo"]').click();

    await expect(page.locator('.todo-item')).toHaveCount(0);
  });

  test('Trim whitespaces when adding a task', async ({ page }) => {
    await addTodo(page, ' Shopping ');
    await expect(todoRow(page, 'Shopping')).toBeVisible();
  });

  test('Editing one task does not mutate the rest', async ({ page }) => {
    await addTodo(page, 'Fix the sink');
    await addTodo(page, 'Wals the dog');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Wals the dog');
      await dialog.accept('Walk the dog');
    });

    await todoRow(page, 'Wals the dog')
      .locator('[data-action="edit-todo"]')
      .click();

    await expect(todoRow(page, 'Walk the dog')).toBeVisible();
    await expect(todoRow(page, 'Fix the sink')).toBeVisible();
  });

  test('Cancel task edit does not mutate state', async ({ page }) => {
    await addTodo(page, 'Fix the sink');
    await addTodo(page, 'Wals the dog');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Wals the dog');
      await dialog.dismiss();
    });

    await todoRow(page, 'Wals the dog')
      .locator('[data-action="edit-todo"]')
      .click();

    await expect(todoRow(page, 'Wals the dog')).toBeVisible();
    await expect(todoRow(page, 'Fix the sink')).toBeVisible();
  });

  test('Reject editing a task with empty input', async ({ page }) => {
    await addTodo(page, 'Fix the sink');
    await addTodo(page, 'Walk the dog');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Walk the dog');
      await dialog.accept('');
    });

    await todoRow(page, 'Walk the dog')
      .locator('[data-action="edit-todo"]')
      .click();

    await expect(todoRow(page, 'Walk the dog')).toBeVisible();
    await expect(todoRow(page, 'Fix the sink')).toBeVisible();
  });

  test('Deleting a task does not mutate other tasks', async ({ page }) => {
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');

    await todoRow(page, 'Task 2')
      .locator('[data-action="delete-todo"]')
      .click();

    await expect(todoRow(page, 'Task 2')).toHaveCount(0);
    await expect(todoRow(page, 'Task 1')).toBeVisible();
    await expect(todoRow(page, 'Task 3')).toBeVisible();
  });

  test('Marking a task as completed does not mutate other tasks', async ({
    page,
  }) => {
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');

    await todoRow(page, 'Task 2')
      .locator('[data-action="toggle-completed"]')
      .click();

    await expect(todoRow(page, 'Task 2')).toHaveClass(/completed/);
    await expect(todoRow(page, 'Task 1')).not.toHaveClass(/completed/);
    await expect(todoRow(page, 'Task 3')).not.toHaveClass(/completed/);
  });

  test('Toggling a complete task returns to not completed ', async ({
    page,
  }) => {
    await addTodo(page, 'Task 1');
    await addTodo(page, 'Task 2');
    await addTodo(page, 'Task 3');

    await todoRow(page, 'Task 2')
      .locator('[data-action="toggle-completed"]')
      .click();

    await todoRow(page, 'Task 2')
      .locator('[data-action="toggle-completed"]')
      .click();

    await expect(todoRow(page, 'Task 2')).not.toHaveClass(/completed/);
  });
});
