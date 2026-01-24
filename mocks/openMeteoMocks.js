export async function mockOpenMeteo(page) {
  await page.route(
    'https://geocoding-api.open-meteo.com/v1/search?**',
    async (route) => {
      const url = new URL(route.request().url());
      const name = (url.searchParams.get('name') || '').toLowerCase();

      const cities = {
        plovdiv: { name: 'Plovdiv', latitude: 42.15, longitude: 24.75 },
        sofia: { name: 'Sofia', latitude: 42.6977, longitude: 23.3219 },
        london: { name: 'London', latitude: 51.5072, longitude: -0.1276 },
        varna: { name: 'Varna', latitude: 43.2141, longitude: 27.9147 },
        burgas: { name: 'Burgas', latitude: 42.5048, longitude: 27.4626 },
        prague: { name: 'Prague', latitude: 50.0755, longitude: 14.4378 },
        'são paulo': {
          name: 'São Paulo',
          latitude: -23.5505,
          longitude: -46.6333,
        },
        'sao paulo': {
          name: 'São Paulo',
          latitude: -23.5505,
          longitude: -46.6333,
        },
      };

      const hit = cities[name];

      const body = hit
        ? {
            results: [
              {
                name: hit.name,
                latitude: hit.latitude,
                longitude: hit.longitude,
                country: 'Mockland',
              },
            ],
          }
        : { results: [] };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    },
  );

  await page.route(
    'https://api.open-meteo.com/v1/forecast?**',
    async (route) => {
      const url = new URL(route.request().url());
      const lat = Number(url.searchParams.get('latitude'));
      const lon = Number(url.searchParams.get('longitude'));

      const days = 6;
      const today = new Date('2026-01-24'); // fixed for determinism in CI
      const time = Array.from({ length: days }, (_, i) => {
        const d = new Date(today);
        d.setDate(d.getDate() + i);
        return d.toISOString().slice(0, 10);
      });

      const body = {
        latitude: lat,
        longitude: lon,
        timezone: 'auto',
        current: {
          temperature_2m: 10.2,
          relative_humidity_2m: 65,
          wind_speed_10m: 3.4,
          surface_pressure: 1016.2,
        },
        daily: {
          time,
          temperature_2m_max: [12, 11, 10, 9, 8, 7],
          temperature_2m_min: [5, 4, 3, 2, 1, 0],
        },
      };

      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    },
  );
}
