import { test, expect } from '@playwright/test';
import loginPage from '../Pages/loginModule/loginPage';
import productPage from '../Pages/productsModule/productPage';
import productDetailsPage from '../Pages/productsModule/productDetailsPage';
import cartPage from '../Pages/cartModule/cartPage';
import checkoutInfoPage from '../Pages/checkoutModule/checkoutInfoPage';
import checkoutOverviewPage from '../Pages/checkoutModule/checkoutOverviewPage';
import checkoutCompletePage from '../Pages/checkoutModule/checkoutCompletePage';
import menuPage from '../Pages/menuModule/menuPage';
import appSettings from '../Test Data/appSettings.json';

test.beforeEach('Preconditions', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://www.saucedemo.com/');
});


async function login(page: any) {
  // Login with valid credentials
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Valid);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);
  await page.locator(loginPage.loginBtnLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
}

async function logout(page: any) {
  // Open the burger menu and click Logout
  await page.locator(menuPage.openMenuBtnLocator).click();
  await page.locator(menuPage.logoutLinkLocator).click();

  // Verify the user is redirected to the login page
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator(loginPage.loginBtnLocator)).toBeVisible();
}

async function addProductToCart(page: any, product: any) {
  // Click add to cart button for the product on the inventory page
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: product.Name }).locator(productPage.itemBtnLocator).click();
}

async function checkoutAndFinish(page: any) {
  // Click Checkout button and enter valid checkout information
  await page.locator(cartPage.checkoutBtnLocator).click();
  await page.locator(checkoutInfoPage.firstNameLocator).fill(appSettings.Checkout.FirstName.Valid);
  await page.locator(checkoutInfoPage.lastNameLocator).fill(appSettings.Checkout.LastName.Valid);
  await page.locator(checkoutInfoPage.postalCodeLocator).fill(appSettings.Checkout.PostalCode.Valid);
  await page.locator(checkoutInfoPage.continueBtnLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

  // Verify checkout totals
  await expect(page.locator(checkoutOverviewPage.cartItemLocator).first()).toBeVisible();
  const prices = (await page.locator(checkoutOverviewPage.itemPriceLocator).allTextContents()).map((price: string) => parseFloat(price.replace('$', '')));
  const itemTotal = prices.reduce((sum: number, price: number) => sum + price, 0);
  const tax = Math.round(itemTotal * checkoutOverviewPage.taxRate * 100) / 100;
  await expect(page.locator(checkoutOverviewPage.itemTotalLocator)).toHaveText(`Item total: $${itemTotal.toFixed(2)}`);
  await expect(page.locator(checkoutOverviewPage.totalLocator)).toHaveText(`Total: $${(itemTotal + tax).toFixed(2)}`);

  // Click Finish button
  await page.locator(checkoutOverviewPage.finishBtnLocator).click();

  // Verify the order confirmation is displayed and the cart is cleared
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  await expect(page.locator(checkoutCompletePage.completeHeaderLocator)).toHaveText(checkoutCompletePage.completeHeaderMsg);
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();
}

test('SL-67: E2E - Verify user can purchase a single product and logout', async ({page}) => {
  // Login
  await login(page);

  // Add a product to the cart
  await addProductToCart(page, appSettings.Products.Backpack);
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');

  // Open the cart and verify the product
  await page.locator(productPage.shoppingCartLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(1);
  await expect(page.locator(cartPage.cartItemLocator).locator(cartPage.itemNameLocator)).toHaveText(appSettings.Products.Backpack.Name);

  // Checkout and complete the order
  await checkoutAndFinish(page);

  // Click Back Home button
  await page.locator(checkoutCompletePage.backHomeBtnLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // Logout
  await logout(page);
});

test('SL-68: E2E - Verify user can purchase multiple products after removing one from the cart', async ({page}) => {
  // Login
  await login(page);

  // Add three products to the cart
  await addProductToCart(page, appSettings.Products.Backpack);
  await addProductToCart(page, appSettings.Products.BoltTShirt);
  await addProductToCart(page, appSettings.Products.FleeceJacket);
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('3');

  // Open the cart and remove one product
  await page.locator(productPage.shoppingCartLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await page.locator(cartPage.cartItemLocator).filter({ hasText: appSettings.Products.BoltTShirt.Name }).locator(cartPage.removeBtnLocator).click();
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(2);
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('2');

  // Checkout and complete the order
  await checkoutAndFinish(page);
});

test('SL-69: E2E - Verify user can purchase the cheapest product from its details page', async ({page}) => {
  // Login
  await login(page);

  // Sort products by price (low to high)
  await page.locator(productPage.productSortLocator).selectOption(appSettings.Sort.PriceLowToHigh);
  await expect(page.locator(productPage.itemNameLocator).first()).toHaveText(appSettings.Products.Onesie.Name);

  // Open the cheapest product details page and add it to the cart
  await page.locator(productPage.itemNameLocator).first().click();
  await expect(page.locator(productDetailsPage.itemNameLocator)).toHaveText(appSettings.Products.Onesie.Name);
  await expect(page.locator(productDetailsPage.itemPriceLocator)).toHaveText(appSettings.Products.Onesie.Price);
  await page.locator(productDetailsPage.addToCartBtnLocator).click();
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');

  // Open the cart and verify the product
  await page.locator(productPage.shoppingCartLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator(cartPage.cartItemLocator).locator(cartPage.itemNameLocator)).toHaveText(appSettings.Products.Onesie.Name);
  await expect(page.locator(cartPage.cartItemLocator).locator(cartPage.itemPriceLocator)).toHaveText(appSettings.Products.Onesie.Price);

  // Checkout and complete the order
  await checkoutAndFinish(page);
});

test('SL-70: E2E - Verify cart is cleared after Reset App State and logout', async ({page}) => {
  // Login
  await login(page);

  // Add two products to the cart
  await addProductToCart(page, appSettings.Products.BikeLight);
  await addProductToCart(page, appSettings.Products.RedTShirt);
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('2');

  // Open the burger menu and click Reset App State
  await page.locator(menuPage.openMenuBtnLocator).click();
  await page.locator(menuPage.resetAppStateLinkLocator).click();
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();

  // Close the burger menu
  await page.locator(menuPage.closeMenuBtnLocator).click();
  await expect(page.locator(menuPage.menuWrapLocator)).toHaveAttribute('aria-hidden', 'true');

  // Logout and login again
  await logout(page);
  await login(page);

  // Verify the cart is still empty
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();
  await page.locator(productPage.shoppingCartLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(0);
});

test('SL-71: E2E - Verify cart is kept after logout and login again', async ({page}) => {
  // Login
  await login(page);

  // Add a product to the cart
  await addProductToCart(page, appSettings.Products.FleeceJacket);
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');

  // Logout and login again
  await logout(page);
  await login(page);

  // Verify the product is still in the cart
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');
  await page.locator(productPage.shoppingCartLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator(cartPage.cartItemLocator).locator(cartPage.itemNameLocator)).toHaveText(appSettings.Products.FleeceJacket.Name);

  // Checkout and complete the order
  await checkoutAndFinish(page);
});
