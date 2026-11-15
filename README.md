# SauceDemo Playwright Tests

End-to-end UI automation for [SauceDemo](https://www.saucedemo.com/) using [Playwright](https://playwright.dev/).

## What this project covers

- Login, products (inventory and sorting), product details, cart, checkout and burger menu modules
- Per-user tests for each SauceDemo test account (standard, problem, performance_glitch, error, visual)
- End-to-end purchase flows
- Page Object Model structure with one folder per module
- Externalized test data for logins, products, sorting and checkout
- Known SauceDemo bugs tracked with `test.fail()` so they show as expected failures
- Cross-browser execution in Chromium, Firefox, and WebKit
- HTML test reporting through Playwright

## Project structure

- `Tests/Pages/` - page objects, one folder per module: `loginModule`, `productsModule`, `cartModule`, `checkoutModule`, `menuModule`
- `Tests/Specs/` - Playwright test specs
- `Tests/Test Data/` - externalized test data and credentials
- `playwright.config.ts` - test runner configuration
- `playwright-report/` - generated HTML report output
- `test-results/` - generated artifacts from test runs

## Prerequisites

- Node.js 18 or later
- npm
- Playwright is pinned to 1.64.x (`@playwright/test` `~1.64.1`), which uses browser builds chromium-1248, firefox-1555 and webkit-2370

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

Run a single spec in one browser:

```bash
npx playwright test Tests/Specs/checkout.spec.ts --project=chromium
```

Run everything in Chromium only:

```bash
npx playwright test --project=chromium
```

## View the report

After a run, open the HTML report with:

```bash
npx playwright show-report
```

## Test coverage

Test IDs (SL-xx) are placeholder Jira keys.

| Spec | IDs | Covers |
| --- | --- | --- |
| `login.spec.ts` | SL-7 to SL-17 | Valid login, post-login UI, invalid credentials, empty fields, locked-out user, SQL and script injection |
| `products.spec.ts` | SL-18 to SL-28 | Inventory display, 4 sort options, add/remove from inventory, product details, add from details, back to products |
| `cart.spec.ts` | SL-29 to SL-33 | Products in cart, remove, continue shopping, empty cart, checkout with empty cart (known bug) |
| `checkout.spec.ts` | SL-34 to SL-42 | Valid info, empty field errors, cancel, overview items and totals (8% tax), finish order, back home |
| `menu.spec.ts` | SL-43 to SL-48 | Open/close menu, All Items, About, logout (inventory blocked afterwards), Reset App State |
| `users.spec.ts` | SL-49 to SL-66 | Data-driven tests per SauceDemo account: purchase flow, sorting, add/remove, images, checkout fields, visual_user layout and prices, performance_glitch_user login time |
| `e2e.spec.ts` | SL-67 to SL-71 | Single and multi-product purchase, sort and buy cheapest, Reset App State, cart kept across logout/login |

`locked_out_user` is covered by SL-17.

## Known SauceDemo bugs (expected failures)

These bugs are asserted as correct behaviour and marked with `test.fail()`. They appear as "expected to fail" in the report and will start failing (alerting us) once SauceDemo fixes the bug.

- All users: checkout is allowed with an empty cart
- `problem_user`: all product images are the same 404 image, sorting does nothing, some products cannot be added/removed, Last Name overwrites First Name
- `error_user`: sorting shows a "Sorting is broken!" alert, some products cannot be added/removed, Last Name cannot be filled, Finish does nothing
- `visual_user`: wrong Backpack image, random prices, misplaced cart icon/button
- `performance_glitch_user`: inventory takes about 5 seconds to render after login

## Notes

- Tests currently use the public SauceDemo site directly: https://www.saucedemo.com/
- Test cases are written in Jira: https://swaglabsdemo.atlassian.net/
- Playwright is configured to run against desktop Chromium, Firefox, and WebKit.
