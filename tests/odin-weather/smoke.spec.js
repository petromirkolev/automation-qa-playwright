import { test, expect } from './test-options.js';

test.describe('Smoke test suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('./');
  });

  test('App loads and main UI is visible', async ({ weather }) => {
    await expect(weather.loc.input).toBeVisible();
    await expect(weather.loc.searchButton).toBeVisible();
    await expect(weather.loc.currWeather).toBeVisible();
    await expect(weather.loc.forecast).toBeVisible();
  });

  test('Search for a known valid city', async ({ weather }) => {
    await weather.search('London');
    await expect(weather.loc.currHumidity).toContainText('%');
    await expect(weather.loc.currWind).toContainText('m/s');
    await expect(weather.loc.currPressure).toContainText('hPa');
  });

  test('Loading state appears then disappears', async ({ weather }) => {
    await weather.search('London');
    await weather.waitReady();
    await expect(weather.loc.statusMessage).not.toHaveText('Loading...');
  });

  test('Search via mouse click', async ({ weather }) => {
    await weather.loc.input.fill('London');
    await weather.loc.searchButton.click();
    await weather.waitReady();
    await expect(weather.loc.currLocation).toHaveText('London');
  });

  test('Search via Enter key', async ({ weather }) => {
    await weather.loc.input.fill('London');
    await weather.loc.input.press('Enter');
    await expect(weather.loc.currLocation).toHaveText('London');
  });
});
