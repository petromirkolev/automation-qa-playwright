import { test, expect } from '@playwright/test';
import { ToDo } from './page-objects/ToDo';

test.describe('Edge cases test suite', () => {
  let todo;
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    todo = new ToDo(page);
  });

  test('Add task by Enter key', async () => {
    await todo.loc.taskInput.fill('Get money');
    await todo.loc.taskInput.press('Enter');
    await expect(todo.row('Get money')).toBeVisible();
  });

  test('Reject adding an empty task', async () => {
    await todo.add('  ');
    await expect(todo.loc.taskRow).toHaveCount(0);
  });

  test('Trim whitespaces when adding a task', async () => {
    await todo.add(' Shopping ');
    await expect(todo.row('Shopping')).toBeVisible();
  });

  test('Editing one task does not mutate the rest', async ({ page }) => {
    await todo.add('Fix the sink');
    await todo.add('Wals the dog');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Wals the dog');
      await dialog.accept('Walk the dog');
    });

    await todo.editBtn('Wals the dog').click();

    await expect(todo.row('Walk the dog')).toBeVisible();
    await expect(todo.row('Fix the sink')).toBeVisible();
  });

  test('Cancel task edit does not mutate state', async ({ page }) => {
    await todo.add('Fix the sink');
    await todo.add('Wals the dog');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Wals the dog');
      await dialog.dismiss();
    });

    await todo.editBtn('Wals the dog').click();

    await expect(todo.row('Wals the dog')).toBeVisible();
    await expect(todo.row('Fix the sink')).toBeVisible();
  });

  test('Reject editing a task with empty input', async ({ page }) => {
    await todo.add('Fix the sink');
    await todo.add('Walk the dog');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Walk the dog');
      await dialog.accept('');
    });

    await todo.editBtn('Walk the dog').click();

    await expect(todo.row('Walk the dog')).toBeVisible();
    await expect(todo.row('Fix the sink')).toBeVisible();
  });

  test('Deleting a task does not mutate other tasks', async () => {
    await todo.add('Task 1');
    await todo.add('Task 2');
    await todo.add('Task 3');

    await todo.deleteBtn('Task 2').click();

    await expect(todo.row('Task 2')).toHaveCount(0);
    await expect(todo.row('Task 1')).toBeVisible();
    await expect(todo.row('Task 3')).toBeVisible();
  });

  test('Marking a task as completed does not mutate other tasks', async () => {
    await todo.add('Task 1');
    await todo.add('Task 2');
    await todo.add('Task 3');

    await todo.toggleCompleted('Task 2').click();

    await expect(todo.row('Task 2')).toHaveClass(/completed/);
    await expect(todo.row('Task 1')).not.toHaveClass(/completed/);
    await expect(todo.row('Task 3')).not.toHaveClass(/completed/);
  });

  test('Toggling a complete task returns to not completed ', async () => {
    await todo.add('Task 1');
    await todo.add('Task 2');
    await todo.add('Task 3');

    await todo.toggleCompleted('Task 2').click();
    await todo.toggleCompleted('Task 2').click();

    await expect(todo.row('Task 2')).not.toHaveClass(/completed/);
  });
});
