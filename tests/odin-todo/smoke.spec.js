import { test, expect } from '@playwright/test';
import { ToDo } from './page-objects/ToDo';

test.describe('Smoke test suite', () => {
  let todo;

  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    todo = new ToDo(page);
  });

  test('App is loaded and UI is visible', async () => {
    await expect(todo.loc.taskInput).toBeVisible();

    await expect(todo.loc.addButton).toBeVisible();

    await expect(todo.loc.taskList).toBeVisible();
  });

  test('Add a task', async () => {
    await todo.add('Buy a book');

    await expect(todo.row('Buy a book')).toBeVisible();
  });

  test('Mark task as completed', async () => {
    await todo.add('Buy a book');

    await todo.toggleCompleted('Buy a book').click();

    await expect(todo.row('Buy a book')).toHaveClass(/completed/);
  });

  test('Mark task as not completed', async () => {
    await todo.add('Buy a book');

    await todo.toggleCompleted('Buy a book').click();
    await todo.toggleCompleted('Buy a book').click();

    await expect(todo.row('Buy a book')).not.toHaveClass(/completed/);
  });

  test('Edit task updates text', async ({ page }) => {
    await todo.add('Buy a book');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Buy a book');
      await dialog.accept('Buy books instead!');
    });

    await todo.editBtn('Buy a book').click();

    await expect(todo.row('Buy books instead!')).toBeVisible();
  });

  test('Delete task removes it', async () => {
    await todo.add('Buy a book');
    await todo.add('Buy a coffee');

    await todo.deleteBtn('Buy a book').click();

    await expect(todo.row('Buy a book')).toHaveCount(0);
    await expect(todo.row('Buy a coffee')).toBeVisible();
  });
});
