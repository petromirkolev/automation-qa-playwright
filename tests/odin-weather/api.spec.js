import { test, expect } from '@playwright/test';

test.describe('API test suite', () => {
  test('Known city returns results with lat/lon', async ({ request }) => {
    const city = 'Plovdiv';

    const response = await request.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`,
    );

    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    expect(Array.isArray(data.results)).toBeTruthy();
    expect(data.results.length).toBeGreaterThan(0);

    const first = data.results[0];

    expect(first.name.toLowerCase()).toContain(city.toLowerCase());
    expect(typeof first.latitude).toBe('number');
    expect(typeof first.longitude).toBe('number');
  });

  test('Invalid city returns empty results', async ({ request }) => {
    const city = 'Invalidcityinput';

    const response = await request.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`,
    );

    expect(response.ok()).toBeTruthy();

    const data = await response.json();

    expect(data.results ?? []).toHaveLength(0);
  });

  test('Forecast returns expected data + forecast', async ({ request }) => {
    // Get city coords first
    const city = 'Plovdiv';
    const cityResponse = await request.get(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=10&language=en&format=json`,
    );

    expect(cityResponse.ok()).toBeTruthy();

    const cityData = await cityResponse.json();
    const lat = cityData.results[0].latitude;
    const lon = cityData.results[0].longitude;

    const weatherResponse = await request.get(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,surface_pressure,cloud_cover&daily=temperature_2m_max,temperature_2m_min&forecast_days=6&timezone=auto`,
    );

    expect(weatherResponse.ok()).toBeTruthy();

    const weatherData = await weatherResponse.json();

    expect(weatherData.current.temperature_2m).toEqual(expect.any(Number));
    expect(weatherData.daily.time).toHaveLength(6);
    expect(weatherData.daily.temperature_2m_max).toHaveLength(6);
    expect(weatherData.daily.temperature_2m_min).toHaveLength(6);
  });
});
