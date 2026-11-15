import { test, expect } from '@playwright/test';
import loginPage from '../Pages/loginModule/loginPage';
import productPage from '../Pages/productsModule/productPage';
import cartPage from '../Pages/cartModule/cartPage';
import checkoutInfoPage from '../Pages/checkoutModule/checkoutInfoPage';
import checkoutOverviewPage from '../Pages/checkoutModule/checkoutOverviewPage';
import checkoutCompletePage from '../Pages/checkoutModule/checkoutCompletePage';
import appSettings from '../Test Data/appSettings.json';

test.beforeEach('Preconditions', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://www.saucedemo.com/');

  // Login with valid credentials
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Valid);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);
  await page.locator(loginPage.loginBtnLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');

  // Add two products to the cart
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Backpack.Name }).locator(productPage.itemBtnLocator).click();
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.BikeLight.Name }).locator(productPage.itemBtnLocator).click();

  // Open the cart and click Checkout button
  await page.locator(productPage.shoppingCartLocator).click();
  await page.locator(cartPage.checkoutBtnLocator).click();
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
});


async function fillCheckoutInfo(page: any, firstName: string, lastName: string, postalCode: string) {
  // Enter checkout information and click Continue button
  await page.locator(checkoutInfoPage.firstNameLocator).fill(firstName);
  await page.locator(checkoutInfoPage.lastNameLocator).fill(lastName);
  await page.locator(checkoutInfoPage.postalCodeLocator).fill(postalCode);
  await page.locator(checkoutInfoPage.continueBtnLocator).click();
}

async function invalidCheckoutInfo(page: any) {
  // Expected Results for invalid checkout information
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-one.html');
  await expect(page.locator(checkoutInfoPage.errorMsgLocator)).toBeVisible();

  const firstName = await page.locator(checkoutInfoPage.firstNameLocator).inputValue();
  const lastName = await page.locator(checkoutInfoPage.lastNameLocator).inputValue();

  if (firstName === appSettings.Checkout.FirstName.Empty){
    await expect(page.locator(checkoutInfoPage.errorMsgLocator)).toHaveText(checkoutInfoPage.firstNameRequiredMsg);
  }
  else if (lastName === appSettings.Checkout.LastName.Empty){
    await expect(page.locator(checkoutInfoPage.errorMsgLocator)).toHaveText(checkoutInfoPage.lastNameRequiredMsg);
  }
  else await expect(page.locator(checkoutInfoPage.errorMsgLocator)).toHaveText(checkoutInfoPage.postalCodeRequiredMsg);
}

async function checkoutTotals(page: any) {
  // Expected Results for checkout overview totals
  await expect(page.locator(checkoutOverviewPage.cartItemLocator).first()).toBeVisible();
  const prices = (await page.locator(checkoutOverviewPage.itemPriceLocator).allTextContents()).map((price: string) => parseFloat(price.replace('$', '')));
  const itemTotal = prices.reduce((sum: number, price: number) => sum + price, 0);
  const tax = Math.round(itemTotal * checkoutOverviewPage.taxRate * 100) / 100;

  await expect(page.locator(checkoutOverviewPage.itemTotalLocator)).toHaveText(`Item total: $${itemTotal.toFixed(2)}`);
  await expect(page.locator(checkoutOverviewPage.taxLocator)).toHaveText(`Tax: $${tax.toFixed(2)}`);
  await expect(page.locator(checkoutOverviewPage.totalLocator)).toHaveText(`Total: $${(itemTotal + tax).toFixed(2)}`);
}

test('SL-34: Verify user can continue checkout with valid information', async ({page}) => {
  // Enter valid checkout information
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Valid, appSettings.Checkout.LastName.Valid, appSettings.Checkout.PostalCode.Valid);

  // Verify the user is redirected to the checkout overview page
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');
  await expect(page.locator(checkoutOverviewPage.pageTitleLocator)).toHaveText(checkoutOverviewPage.pageTitle);
});

test('SL-35: Verify that system handles empty first name', async ({page}) => {
  // Enter Last Name and Postal Code but leave First Name empty
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Empty, appSettings.Checkout.LastName.Valid, appSettings.Checkout.PostalCode.Valid);

  // Expected Results for empty first name
  await invalidCheckoutInfo(page);
});

test('SL-36: Verify that system handles empty last name', async ({page}) => {
  // Enter First Name and Postal Code but leave Last Name empty
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Valid, appSettings.Checkout.LastName.Empty, appSettings.Checkout.PostalCode.Valid);

  // Expected Results for empty last name
  await invalidCheckoutInfo(page);
});

test('SL-37: Verify that system handles empty postal code', async ({page}) => {
  // Enter First Name and Last Name but leave Postal Code empty
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Valid, appSettings.Checkout.LastName.Valid, appSettings.Checkout.PostalCode.Empty);

  // Expected Results for empty postal code
  await invalidCheckoutInfo(page);
});

test('SL-38: Verify Cancel button on checkout information returns to the cart', async ({page}) => {
  // Click Cancel button
  await page.locator(checkoutInfoPage.cancelBtnLocator).click();

  // Verify the user is redirected to the cart page with products kept
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(2);
});

test('SL-39: Verify checkout overview displays the correct products and totals', async ({page}) => {
  // Enter valid checkout information
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Valid, appSettings.Checkout.LastName.Valid, appSettings.Checkout.PostalCode.Valid);

  // Verify the products in the overview
  await expect(page.locator(checkoutOverviewPage.cartItemLocator)).toHaveCount(2);
  await expect(page.locator(checkoutOverviewPage.itemNameLocator)).toHaveText([appSettings.Products.Backpack.Name, appSettings.Products.BikeLight.Name]);
  await expect(page.locator(checkoutOverviewPage.itemPriceLocator)).toHaveText([appSettings.Products.Backpack.Price, appSettings.Products.BikeLight.Price]);

  // Expected Results for checkout totals
  await checkoutTotals(page);
});

test('SL-40: Verify Cancel button on checkout overview returns to the inventory page', async ({page}) => {
  // Enter valid checkout information
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Valid, appSettings.Checkout.LastName.Valid, appSettings.Checkout.PostalCode.Valid);

  // Click Cancel button
  await page.locator(checkoutOverviewPage.cancelBtnLocator).click();

  // Verify the user is redirected to the inventory page with the cart kept
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('2');
});

test('SL-41: Verify user can complete the order', async ({page}) => {
  // Enter valid checkout information
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Valid, appSettings.Checkout.LastName.Valid, appSettings.Checkout.PostalCode.Valid);

  // Click Finish button
  await page.locator(checkoutOverviewPage.finishBtnLocator).click();

  // Verify the order confirmation is displayed
  await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
  await expect(page.locator(checkoutCompletePage.pageTitleLocator)).toHaveText(checkoutCompletePage.pageTitle);
  await expect(page.locator(checkoutCompletePage.completeHeaderLocator)).toHaveText(checkoutCompletePage.completeHeaderMsg);
  await expect(page.locator(checkoutCompletePage.completeTextLocator)).toHaveText(checkoutCompletePage.completeTextMsg);

  // Verify the cart is cleared
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();
});

test('SL-42: Verify Back Home button returns to the inventory page after the order', async ({page}) => {
  // Complete the order
  await fillCheckoutInfo(page, appSettings.Checkout.FirstName.Valid, appSettings.Checkout.LastName.Valid, appSettings.Checkout.PostalCode.Valid);
  await page.locator(checkoutOverviewPage.finishBtnLocator).click();

  // Click Back Home button
  await page.locator(checkoutCompletePage.backHomeBtnLocator).click();

  // Verify the user is redirected to the inventory page with an empty cart
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();
  await expect(page.locator(productPage.addToCartBtnLocator)).toHaveCount(productPage.productsCount);
});
