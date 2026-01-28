import { test, expect } from './test-options.js';

test.describe('Core functions test suite', () => {
  test.beforeEach(async ({ gotoFresh, todo }) => {
    await gotoFresh();
    await todo.add('Get milk');
    await todo.add('Get beer');
    await todo.add('Get water');
  });

  test('Show all tasks', async ({ todo }) => {
    await todo.loc.filterTasks.selectOption({ value: 'all' });
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Get water', 'Get beer', 'Get milk']);
  });

  test('Show active tasks', async ({ todo }) => {
    await todo.toggleCompleted('Get beer').click();
    await todo.loc.filterTasks.selectOption({ value: 'active' });
    await expect.poll(todo.getVisibleTitles).toEqual(['Get water', 'Get milk']);
  });

  test('Show completed tasks', async ({ todo }) => {
    await todo.toggleCompleted('Get beer').click();
    await todo.loc.filterTasks.selectOption({ value: 'completed' });
    await expect.poll(todo.getVisibleTitles).toEqual(['Get beer']);
  });

  test('Clear completed tasks', async ({ todo }) => {
    await todo.toggleCompleted('Get beer').click();
    await todo.loc.filterTasks.selectOption({ value: 'all' });
    await todo.loc.clearCompletedTasks.click();
    await expect.poll(todo.getVisibleTitles).toEqual(['Get water', 'Get milk']);
  });

  test('Clear all tasks', async ({ todo }) => {
    await todo.loc.filterTasks.selectOption({ value: 'all' });
    await todo.loc.clearAllTasks.click();
    await expect.poll(todo.getVisibleTitles).toEqual([]);
  });

  test('Clear search restores tasks list', async ({ todo }) => {
    await todo.loc.searchTask.fill('be');
    await todo.loc.searchTask.fill('');
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Get water', 'Get beer', 'Get milk']);
  });
});
