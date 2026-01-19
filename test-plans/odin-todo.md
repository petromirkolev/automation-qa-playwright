# Test Plan — Odin Todo (Playwright)

## Target

[https://petromirkolev.github.io/js-foundations-projects/projects/odin-todo/src/index.html](https://petromirkolev.github.io/js-foundations-projects/projects/odin-todo/src/index.html)

## Smoke

- App loads and main UI is visible
- Add a task and verify it appears

## Core flows (initial)

- Toggle task complete
- Delete task
- Filter: all / active / completed (if available)
- Search (if available)
- Sort (if available)
- Clear completed / clear all (if available)

## Notes

- Prefer "data-testid" selectors if present; otherwise use role/text selectors carefully.
