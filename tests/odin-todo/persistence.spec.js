import { test, expect } from '@playwright/test';
import { ToDo } from './page-objects/ToDo';

test.describe('Persistence test suite', () => {
  let todo;

  test.beforeEach(async ({ page }) => {
    todo = new ToDo(page);
  });

  test('Tasks persist after page reload', async ({ page }) => {
    await todo.gotoFresh();
    await todo.add('Get milk');
    await page.reload();
    await expect(todo.row('Get milk')).toBeVisible();
  });

  test('Completed task persists after page reload', async ({ page }) => {
    await todo.gotoFresh();
    await todo.add('Get milk');
    await todo.toggleCompleted('Get milk').click();
    await page.reload();
    await expect(todo.row('Get milk')).toHaveClass(/completed/);
  });

  test('Edited task title persists after page reload', async ({ page }) => {
    await todo.gotoFresh();
    await todo.add('Get milk');

    page.once('dialog', async (dialog) => {
      expect(dialog.type()).toBe('prompt');
      expect(dialog.message()).toContain('Edit task');
      expect(dialog.defaultValue()).toContain('Get milk');
      await dialog.accept('Walk the dog');
    });

    await todo.editBtn('Get milk').click();
    await page.reload();
    await expect(todo.row('Get milk')).toHaveCount(0);
    await expect(todo.row('Walk the dog')).toBeVisible();
  });

  test('Deleted task remains deleted after page reload', async ({ page }) => {
    await todo.gotoFresh();
    await todo.add('Get milk');
    await todo.add('Get beer');
    await todo.deleteBtn('Get milk').click();
    await page.reload();
    await expect(todo.row('Get beer')).toBeVisible();
    await expect(todo.row('Get milk')).toHaveCount(0);
  });
});
