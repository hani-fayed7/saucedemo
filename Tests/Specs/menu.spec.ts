import { test, expect } from '@playwright/test';
import loginPage from '../Pages/loginModule/loginPage';
import productPage from '../Pages/productsModule/productPage';
import menuPage from '../Pages/menuModule/menuPage';
import appSettings from '../Test Data/appSettings.json';

test.beforeEach('Preconditions', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://www.saucedemo.com/');

  // Login with valid credentials
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Valid);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);
  await page.locator(loginPage.loginBtnLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
});


async function openMenu(page: any) {
  // Click the burger menu button
  await page.locator(menuPage.openMenuBtnLocator).click();

  // Expected Results for opened menu
  await expect(page.locator(menuPage.menuWrapLocator)).toHaveAttribute('aria-hidden', 'false');
  await expect(page.locator(menuPage.allItemsLinkLocator)).toBeVisible();
  await expect(page.locator(menuPage.aboutLinkLocator)).toBeVisible();
  await expect(page.locator(menuPage.logoutLinkLocator)).toBeVisible();
  await expect(page.locator(menuPage.resetAppStateLinkLocator)).toBeVisible();
}

test('SL-43: Verify burger menu opens with all options', async ({page}) => {
  // Open the burger menu and verify all options are displayed
  await openMenu(page);
});

test('SL-44: Verify user can close the burger menu', async ({page}) => {
  // Open the burger menu
  await openMenu(page);

  // Click the close (X) button
  await page.locator(menuPage.closeMenuBtnLocator).click();

  // Verify the menu is closed
  await expect(page.locator(menuPage.menuWrapLocator)).toHaveAttribute('aria-hidden', 'true');
});

test('SL-45: Verify All Items option returns to the inventory page', async ({page}) => {
  // Navigate to the cart page
  await page.locator(productPage.shoppingCartLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');

  // Open the burger menu and click All Items
  await openMenu(page);
  await page.locator(menuPage.allItemsLinkLocator).click();

  // Verify the user is redirected to the inventory page
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator(productPage.pageTitleLocator)).toHaveText(productPage.pageTitle);
});

test('SL-46: Verify About option links to the Sauce Labs website', async ({page}) => {
  // Open the burger menu
  await openMenu(page);

  // Verify the About option links to the Sauce Labs website
  await expect(page.locator(menuPage.aboutLinkLocator)).toHaveAttribute('href', menuPage.aboutUrl);
});

test('SL-47: Verify user can logout', async ({page}) => {
  // Open the burger menu and click Logout
  await openMenu(page);
  await page.locator(menuPage.logoutLinkLocator).click();

  // Verify the user is redirected to the login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator(loginPage.loginBtnLocator)).toBeVisible();

  // Verify the user cannot access the inventory page after logout
  await page.goto('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator(loginPage.errorMsgLocator)).toHaveText(loginPage.inventoryAccessDeniedMsg);
});

test('SL-48: Verify Reset App State clears the cart', async ({page}) => {
  // Add two products to the cart
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Backpack.Name }).locator(productPage.itemBtnLocator).click();
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Onesie.Name }).locator(productPage.itemBtnLocator).click();
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('2');

  // Open the burger menu and click Reset App State
  await openMenu(page);
  await page.locator(menuPage.resetAppStateLinkLocator).click();

  // Verify the cart badge is hidden
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();
});
