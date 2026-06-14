# SauceDemo Playwright Tests

End-to-end UI automation for [SauceDemo](https://www.saucedemo.com/) using [Playwright](https://playwright.dev/).

## What this project covers

- Browser-based login testing against SauceDemo
- Cross-browser execution in Chromium, Firefox, and WebKit
- HTML test reporting through Playwright

## Project structure

- `Tests/` - Playwright test specs
- `playwright.config.ts` - test runner configuration
- `playwright-report/` - generated HTML report output
- `test-results/` - generated artifacts from test runs

## Prerequisites

- Node.js 18 or later
- npm

## Installation

```bash
npm install
```

If Playwright browsers are not installed yet:

```bash
npx playwright install
```

## Running tests

Run all tests:

```bash
npx playwright test
```

Run a single test file:

```bash
npx playwright test Tests/login.spec.ts
```

Run tests in headed mode:

```bash
npx playwright test --headed
```

## View the report

After a run, open the HTML report with:

```bash
npx playwright show-report
```

## Test scenario

The current spec verifies that a valid SauceDemo user can:

- log in with `standard_user` / `secret_sauce`
- reach the inventory page
- see key post-login UI elements such as the cart, burger menu, and sort dropdown

## Notes

- Tests currently use the public SauceDemo site directly.
- Playwright is configured to run against desktop Chromium, Firefox, and WebKit.