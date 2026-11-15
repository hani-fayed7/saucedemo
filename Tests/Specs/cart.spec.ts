import { test, expect } from '@playwright/test';
import loginPage from '../Pages/loginModule/loginPage';
import productPage from '../Pages/productsModule/productPage';
import cartPage from '../Pages/cartModule/cartPage';
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


async function addProductToCart(page: any, product: any) {
  // Click add to cart button for the product on the inventory page
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: product.Name }).locator(productPage.itemBtnLocator).click();
}

async function productInCart(page: any, product: any) {
  // Expected Results for a product displayed in the cart
  const cartItem = page.locator(cartPage.cartItemLocator).filter({ hasText: product.Name });
  await expect(cartItem).toBeVisible();
  await expect(cartItem.locator(cartPage.itemNameLocator)).toHaveText(product.Name);
  await expect(cartItem.locator(cartPage.itemPriceLocator)).toHaveText(product.Price);
  await expect(cartItem.locator(cartPage.itemQuantityLocator)).toHaveText('1');
}

test('SL-29: Verify added products are displayed in the cart', async ({page}) => {
  // Add two products to the cart
  await addProductToCart(page, appSettings.Products.Backpack);
  await addProductToCart(page, appSettings.Products.FleeceJacket);

  // Click the cart icon
  await page.locator(productPage.shoppingCartLocator).click();

  // Verify the user is redirected to the cart page
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator(cartPage.pageTitleLocator)).toHaveText(cartPage.pageTitle);

  // Verify the products are displayed with the correct name, price and quantity
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(2);
  await productInCart(page, appSettings.Products.Backpack);
  await productInCart(page, appSettings.Products.FleeceJacket);
});

test('SL-30: Verify user can remove a product from the cart', async ({page}) => {
  // Add two products to the cart and open the cart
  await addProductToCart(page, appSettings.Products.Backpack);
  await addProductToCart(page, appSettings.Products.BikeLight);
  await page.locator(productPage.shoppingCartLocator).click();

  // Click Remove button for one product
  await page.locator(cartPage.cartItemLocator).filter({ hasText: appSettings.Products.Backpack.Name }).locator(cartPage.removeBtnLocator).click();

  // Verify only the other product remains in the cart
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(1);
  await productInCart(page, appSettings.Products.BikeLight);

  // Verify the cart badge shows 1
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');
});

test('SL-31: Verify Continue Shopping button returns to the inventory page', async ({page}) => {
  // Add a product to the cart and open the cart
  await addProductToCart(page, appSettings.Products.Onesie);
  await page.locator(productPage.shoppingCartLocator).click();

  // Click Continue Shopping button
  await page.locator(cartPage.continueShoppingBtnLocator).click();

  // Verify the user is redirected to the inventory page and the cart badge is kept
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');
});

test('SL-32: Verify empty cart is displayed when no products are added', async ({page}) => {
  // Click the cart icon without adding products
  await page.locator(productPage.shoppingCartLocator).click();

  // Verify the cart page is empty
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(0);
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();

  // Verify Continue Shopping and Checkout buttons are visible
  await expect(page.locator(cartPage.continueShoppingBtnLocator)).toBeVisible();
  await expect(page.locator(cartPage.checkoutBtnLocator)).toBeVisible();
});

test('SL-33: Verify user cannot checkout with an empty cart', async ({page}) => {
  // Known bug: SauceDemo allows checkout with an empty cart and completes an order with $0.00 total
  test.fail(true, 'Checkout is allowed with an empty cart');

  // Open the cart without adding products
  await page.locator(productPage.shoppingCartLocator).click();
  await expect(page.locator(cartPage.cartItemLocator)).toHaveCount(0);

  // Click Checkout button
  await page.locator(cartPage.checkoutBtnLocator).click();

  // Verify the user stays on the cart page
  await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
});
