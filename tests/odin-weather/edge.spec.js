import { test, expect } from './test-options.js';

test.describe('Edge test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('Leading/trailing whitespace is trimmed', async ({ weather }) => {
    await weather.searchAndWait(' Prague ');
    await expect(weather.loc.currLocation).toHaveText('Prague');
  });

  test('Empty input is not processed', async ({ weather }) => {
    await weather.search('');
    await expect(weather.loc.currLocation).not.toBeVisible();
  });

  test('Whitespace input is not processed', async ({ weather }) => {
    await weather.search('     ');
    await expect(weather.loc.currLocation).not.toBeVisible();
  });

  test('Special chars are handled properly', async ({ weather }) => {
    await weather.searchAndWait('São Paulo');
    await expect(weather.loc.statusMessage).not.toContainText('Invalid');
  });

  test('Mixed input is accepted', async ({ weather }) => {
    await weather.searchAndWait('lOnDoN');
    await expect(weather.loc.currLocation).toHaveText('London');
  });

  test('Rapid consecutive searches: last search wins', async ({ weather }) => {
    await weather.searchAndWait('Varna');
    await weather.searchAndWait('Burgas');
    await weather.searchAndWait('Plovdiv');
    await expect(weather.loc.currLocation).toHaveText('Plovdiv');
  });

  test('City re-search shows last searched city', async ({ weather }) => {
    await weather.loc.input.fill('Varna');
    await weather.loc.input.fill('');
    await weather.searchAndWait('Burgas');
    await expect(weather.loc.currLocation).toHaveText('Burgas');
  });

  test('Error message disappears after a successful search', async ({
    weather,
  }) => {
    await weather.search('asdasdsadsa');
    await weather.waitReady();

    await expect(weather.loc.statusMessage).toContainText('No results found', {
      timeout: 5_000,
    });

    await weather.searchAndWait('Plovdiv');

    await expect(weather.loc.statusMessage).not.toContainText(
      'No results found',
      {
        timeout: 5_000,
      },
    );
  });
});
