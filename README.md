# Automation QA Portfolio — Playwright

End-to-end (E2E) UI automation tests built with **Playwright**.  
Targets are my own JavaScript apps (Todo / Weather).  
Focus: stable selectors, clean test architecture (POM + fixtures where useful), and CI reliability.

---

## What’s inside

- **UI E2E tests** for real front-end apps
- **POM (Page Object Model)** for maintainable selectors/actions
- **CI runs on GitHub Actions**
- **Mocks** used where external APIs would make CI flaky (Weather)

---

## Repo structure

- ".github/workflows/" — GitHub Actions CI pipeline
- "tests/" — Playwright tests grouped by target app
  - "tests/odin-todo/"
  - "tests/odin-weather/"
  - "tests/registration-form/"
  - "tests/page-objects/" (shared POMs if applicable)
- "mocks/" — mock payloads for CI-stable runs (ex: Weather API)
- "test-plans/" — test plan notes per target app
- "playwright.config.js" — Playwright config

---

## Prerequisites

- **Node.js (LTS recommended)**
- **npm**

---

## Install

```bash
npm install
npx playwright install
```

- On Linux/CI you may need:

```bash
npx playwright install --with-deps
```

## Running tests

- Run all tests:

```bash
npm test
```

- Run with Playwright UI mode:

```bash
npm run ui
```

- Run a specific target (folder):

```bash
npx playwright test tests/odin-todo
npx playwright test tests/odin-weather
npx playwright test tests/registration-form
```

- Run a single spec:

```bash
npx playwright test tests/odin-todo/smoke.spec.js
```

## Base URL / Environment

- Tests navigate using the baseURL configured in playwright.config.js.

## Reports

- Playwright HTML report:

```bash
npm run report
```

## Allure reports

- Generate Allure results:

```bash
npx playwright test --reporter=line,allure-playwright
```

- Generate the report:

```bash
npx allure generate ./allure-results -o ./allure-report --clean
```

- Open the report:

```bash
npx allure open ./allure-report
```

## Notes on CI stability

- Todo suite is deterministic and CI-stable.

- Weather suite can be flaky if it hits real external APIs, so mocks are used for CI stability.

- Registration form suite includes data-driven validation coverage and a network-failure (route abort) scenario.

## Tech stack

- Playwright Test (@playwright/test)

- JavaScript

- Allure reporter (allure-playwright)

- GitHub Actions (CI)
