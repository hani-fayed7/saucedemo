# SauceDemo Playwright Tests

End-to-end UI automation for [SauceDemo](https://www.saucedemo.com/) using [Playwright](https://playwright.dev/).

## What this project covers

- Browser-based login testing against SauceDemo
- Page Object Model structure for login and products pages
- Externalized test data for valid, invalid, and edge-case login scenarios
- Cross-browser execution in Chromium, Firefox, and WebKit
- HTML test reporting through Playwright

## Project structure

- `Tests/Pages/` - page objects used by the tests
- `Tests/Specs/` - Playwright test specs
- `Tests/Test Data/` - externalized test data and credentials
- `playwright.config.ts` - test runner configuration
- `playwright-report/` - generated HTML report output
- `test-results/` - generated artifacts from test runs

## Prerequisites

- Node.js 18 or later
- npm

## Installation

If you are creating a new Playwright project from scratch:

```bash
npm init playwright@latest
```

For this repository, install dependencies with:

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
npx playwright test Tests/Specs/login.spec.ts
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

The login spec now verifies that a SauceDemo user can:

- log in with `standard_user` / `secret_sauce`
- reach the inventory page
- see key post-login UI elements such as the cart, burger menu, and sort dropdown
- handle invalid credentials, empty fields, locked-out users, SQL injection input, and script injection input

## Notes

- Tests currently use the public SauceDemo site directly: https://www.saucedemo.com/
- Test cases are written in Jira: https://swaglabsdemo.atlassian.net/
- Playwright is configured to run against desktop Chromium, Firefox, and WebKit.
