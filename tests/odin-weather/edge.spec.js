import { test, expect } from '@playwright/test';
import { Weather } from './page-objects/Weather';
import { mockOpenMeteo } from '../../mocks/openMeteoMocks.js';

test.describe('Edge test suite', () => {
  let weather;

  test.beforeEach(async ({ page }) => {
    if (process.env.CI) await mockOpenMeteo(page);
    await page.goto('./');
    weather = new Weather(page);
  });

  test('Leading/trailing whitespace is trimmed', async () => {
    await weather.searchAndWait(' Prague ');
    await expect(weather.loc.currLocation).toHaveText('Prague');
  });

  test('Empty input is not processed', async () => {
    await weather.search('');
    await expect(weather.loc.currLocation).not.toBeVisible();
  });

  test('Whitespace input is not processed', async () => {
    await weather.search('     ');
    await expect(weather.loc.currLocation).not.toBeVisible();
  });

  test('Special chars are handled properly', async () => {
    await weather.searchAndWait('São Paulo');
    await expect(weather.loc.statusMessage).not.toContainText('Invalid');
  });

  test('Mixed input is accepted', async () => {
    await weather.searchAndWait('lOnDoN');
    await expect(weather.loc.currLocation).toHaveText('London');
  });

  test('Rapid consecutive searches: last search wins', async () => {
    await weather.searchAndWait('Varna');
    await weather.searchAndWait('Burgas');
    await weather.searchAndWait('Plovdiv');
    await expect(weather.loc.currLocation).toHaveText('Plovdiv');
  });

  test('City re-search shows last searched city', async () => {
    await weather.loc.input.fill('Varna');
    await weather.loc.input.fill('');
    await weather.searchAndWait('Burgas');
    await expect(weather.loc.currLocation).toHaveText('Burgas');
  });

  test('Error message disappears after a successful search', async () => {
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
