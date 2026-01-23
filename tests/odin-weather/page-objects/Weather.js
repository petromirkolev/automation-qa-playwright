import { expect } from '@playwright/test';

export class Weather {
  constructor(page) {
    this.page = page;
    this.loc = {
      input: page.locator('[data-input="location"]'),
      searchButton: page.locator('[data-action="search"]'),
      currWeather: page.locator('.panel-current'),
      forecast: page.locator('.panel-forecast'),
      currLocation: page.locator('[data-view="current-location"]'),
      currTemp: page.locator('[data-view="current-temp"]'),
      currHumidity: page.locator('[data-view="current-humidity"]'),
      currWind: page.locator('[data-view="current-wind"]'),
      currPressure: page.locator('[data-view="current-pressure"]'),
      statusMessage: page.locator('[data-view="status"]'),
      switchToC: page.locator('[data-units="metric"]'),
      switchToF: page.locator('[data-units="imperial"]'),
      lastUpdated: page.locator('[data-view="current-updated"]'),
    };
  }

  async search(city) {
    await this.loc.input.fill(city);
    await this.loc.searchButton.click();
    await expect(this.loc.currLocation).toHaveText(city, { timeout: 10_000 });
  }

  async waitReady() {
    await expect(this.loc.statusMessage).not.toHaveText('Loading...', {
      timeout: 10_000,
    });
  }
}
