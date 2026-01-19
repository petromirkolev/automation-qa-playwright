# Test Plan — Odin Weather (Playwright)

## Target

[https://petromirkolev.github.io/js-foundations-projects/projects/odin-weather/index.html](https://petromirkolev.github.io/js-foundations-projects/projects/odin-weather/index.html)

## Smoke

- App loads and search UI is visible
- Search for a valid city and verify weather output is shown

## Core flows (initial)

- Invalid city shows a clear error state/message
- Loading state appears during fetch (if implemented)
- Units switch works (metric/imperial) if available
- Re-search updates the displayed data

## Notes

- API is third-party; tests should assert stable UI behavior, not exact temperatures.
