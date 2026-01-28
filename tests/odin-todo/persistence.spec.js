import { test, expect } from './test-options.js';

test.describe('Persistence test suite', () => {
  test.beforeEach(async ({ gotoFresh }) => {
    await gotoFresh();
  });

  test('Tasks persist after page reload', async ({ todo, page }) => {
    await todo.add('Get milk');
    await page.reload();
    await expect(todo.row('Get milk')).toBeVisible();
  });

  test('Completed task persists after page reload', async ({ todo, page }) => {
    await todo.add('Get milk');
    await todo.toggleCompleted('Get milk').click();
    await page.reload();
    await expect(todo.row('Get milk')).toHaveClass(/completed/);
  });

  test('Edited task title persists after page reload', async ({
    todo,
    page,
  }) => {
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

  test('Deleted task remains deleted after page reload', async ({
    todo,
    page,
  }) => {
    await todo.add('Get milk');
    await todo.add('Get beer');
    await todo.deleteBtn('Get milk').click();
    await page.reload();
    await expect(todo.row('Get beer')).toBeVisible();
    await expect(todo.row('Get milk')).toHaveCount(0);
  });
});
