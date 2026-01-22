import { test, expect } from '@playwright/test';
import { ToDo } from './page-objects/ToDo';

test.describe('Sorting and searching functions test suite', () => {
  let todo;

  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    todo = new ToDo(page);
    await todo.add('Zebra');
    await todo.add('Alpha');
    await todo.add('Milk');
  });

  test('Search for a specific task', async () => {
    await todo.loc.searchTask.fill('lph');
    await expect(todo.row('Alpha')).toBeVisible();
    await expect(todo.row('Zebra')).toHaveCount(0);
    await expect(todo.row('Milk')).toHaveCount(0);
  });

  test('Search for a non-existing task', async () => {
    await todo.loc.searchTask.fill('candy');
    await expect(todo.row('Alpha')).toHaveCount(0);
    await expect(todo.row('Zebra')).toHaveCount(0);
    await expect(todo.row('Milk')).toHaveCount(0);
    await expect(todo.loc.emptyView).toHaveText('No matching tasks');
  });

  test('Completed task remains completed after sorting', async () => {
    await todo.toggleCompleted('Zebra').click();
    await todo.loc.sortTasks.selectOption({ value: 'textAsc' });
    await expect(todo.row('Zebra')).toHaveClass(/completed/);
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Alpha', 'Milk', 'Zebra']);
  });

  test('Sort persists after clearing search', async () => {
    await todo.loc.sortTasks.selectOption({ value: 'textAsc' });
    await todo.loc.searchTask.fill('candy');
    await todo.loc.searchTask.fill('');
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Alpha', 'Milk', 'Zebra']);
    await todo.loc.sortTasks.selectOption({ value: 'textDesc' });
    await todo.loc.searchTask.fill('candy');
    await todo.loc.searchTask.fill('');
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Zebra', 'Milk', 'Alpha']);
  });

  test('Sort tasks A-Z', async () => {
    await todo.loc.sortTasks.selectOption({ value: 'textAsc' });
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Alpha', 'Milk', 'Zebra']);
  });

  test('Sort tasks Z-A', async () => {
    await todo.loc.sortTasks.selectOption({ value: 'textDesc' });
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Zebra', 'Milk', 'Alpha']);
  });

  test('Sort tasks by newest', async () => {
    await todo.loc.sortTasks.selectOption({ value: 'createdDesc' });
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Milk', 'Alpha', 'Zebra']);
  });

  test('Sort tasks by oldest', async () => {
    await todo.loc.sortTasks.selectOption({ value: 'createdAsc' });
    await expect
      .poll(todo.getVisibleTitles)
      .toEqual(['Zebra', 'Alpha', 'Milk']);
  });
});
