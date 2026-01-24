import { test, expect } from '@playwright/test';
import { Weather } from './page-objects/Weather';

test.describe('Core test suite', () => {
  let weather;

  test.beforeEach(async ({ page }) => {
    await page.goto('./');
    weather = new Weather(page);
  });

  test('Valid search shows current weather and forecast', async () => {
    await weather.search('Plovdiv');
    await weather.waitReady();

    await expect(weather.loc.currLocation).toHaveText('Plovdiv');

    await expect(weather.loc.currTemp).not.toBeEmpty();
    await expect(weather.loc.currHumidity).toContainText('%');
    await expect(weather.loc.currWind).not.toBeEmpty();
    await expect(weather.loc.currPressure).toContainText('hPa');

    const items = weather.loc.forecast.locator('li');
    await expect(items.first()).toBeVisible();
  });

  test('Second search updates results', async ({ page }) => {
    await weather.search('Plovdiv');
    await weather.waitReady();

    const firstUpdated = await weather.loc.lastUpdated.textContent();

    await page.waitForTimeout(1000);

    await weather.search('Sofia');
    await weather.waitReady();

    await expect(weather.loc.currLocation).toHaveText('Sofia');

    const secondUpdated = await weather.loc.lastUpdated.textContent();
    expect(secondUpdated).not.toBe(firstUpdated);
  });

  test('Invalid city search shows a clear error message', async () => {
    await weather.loc.input.fill('асдасдасдас');
    await weather.loc.searchButton.click();

    await expect(weather.loc.statusMessage).toContainText('Invalid', {
      timeout: 10_000,
    });
  });

  test('Units toggle updates displayed temperature unit', async () => {
    await weather.search('Plovdiv');
    await weather.waitReady();

    await weather.loc.switchToF.click();
    await expect(weather.loc.currTemp).toContainText('F');

    await weather.loc.switchToC.click();
    await expect(weather.loc.currTemp).toContainText('C');
  });

  test.skip(
    process.env.CI,
    'Loading state is flaky in CI due to real API timing',
  );

  test('Forecast renders expected count and basic fields', async () => {
    test.skip(
      process.env.CI,
      'Loading state is flaky in CI due to real API timing',
    );
    await weather.search('Plovdiv');
    await weather.waitReady();

    const items = weather.loc.forecast.locator('li');

    await expect(items).toHaveCount(6);

    const first = items.first();
    await expect(first).toBeVisible();
    await expect(first).toHaveClass(/forecast-item/);

    await expect(
      first.locator('[data-view="forecast-date"], .forecast-date'),
    ).toBeVisible();
    await expect(
      first.locator('[data-view="forecast-temp"], .forecast-temp'),
    ).toBeVisible();
  });
});
