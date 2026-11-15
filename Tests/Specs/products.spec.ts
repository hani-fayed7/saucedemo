import { test, expect } from '@playwright/test';
import loginPage from '../Pages/loginModule/loginPage';
import productPage from '../Pages/productsModule/productPage';
import productDetailsPage from '../Pages/productsModule/productDetailsPage';
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


async function sortedProducts(page: any) {
  // Expected Results for product sorting
  const sortOption = await page.locator(productPage.productSortLocator).inputValue();
  const names = await page.locator(productPage.itemNameLocator).allTextContents();
  const prices = (await page.locator(productPage.itemPriceLocator).allTextContents()).map((price: string) => parseFloat(price.replace('$', '')));

  if (sortOption === appSettings.Sort.NameAtoZ){
    expect(names).toEqual([...names].sort());
  }
  else if (sortOption === appSettings.Sort.NameZtoA){
    expect(names).toEqual([...names].sort().reverse());
  }
  else if (sortOption === appSettings.Sort.PriceLowToHigh){
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  }
  else expect(prices).toEqual([...prices].sort((a, b) => b - a));
}

async function productDetails(page: any, product: any) {
  // Expected Results for product details page
  await expect(page).toHaveURL(/inventory-item.html\?id=\d+/);
  await expect(page.locator(productDetailsPage.itemNameLocator)).toHaveText(product.Name);
  await expect(page.locator(productDetailsPage.itemPriceLocator)).toHaveText(product.Price);
  await expect(page.locator(productDetailsPage.itemDescLocator)).toBeVisible();
  await expect(page.locator(productDetailsPage.itemImgLocator)).toBeVisible();
  await expect(page.locator(productDetailsPage.backToProductsBtnLocator)).toBeVisible();
}

test('SL-18: Verify inventory page displays all products', async ({page}) => {
  // Verify page title
  await expect(page.locator(productPage.pageTitleLocator)).toHaveText(productPage.pageTitle);

  // Verify the number of displayed products
  await expect(page.locator(productPage.inventoryItemLocator)).toHaveCount(productPage.productsCount);

  // Verify each product has a name, description, price, image and add to cart button
  await expect(page.locator(productPage.itemNameLocator)).toHaveCount(productPage.productsCount);
  await expect(page.locator(productPage.itemDescLocator)).toHaveCount(productPage.productsCount);
  await expect(page.locator(productPage.itemPriceLocator)).toHaveCount(productPage.productsCount);
  await expect(page.locator(productPage.itemImgLocator)).toHaveCount(productPage.productsCount);
  await expect(page.locator(productPage.addToCartBtnLocator)).toHaveCount(productPage.productsCount);
});

test('SL-19: Verify products can be sorted by name (A to Z)', async ({page}) => {
  // Select Name (A to Z) sort option
  await page.locator(productPage.productSortLocator).selectOption(appSettings.Sort.NameAtoZ);

  // Expected Results for sorting
  await sortedProducts(page);
});

test('SL-20: Verify products can be sorted by name (Z to A)', async ({page}) => {
  // Select Name (Z to A) sort option
  await page.locator(productPage.productSortLocator).selectOption(appSettings.Sort.NameZtoA);

  // Expected Results for sorting
  await sortedProducts(page);
});

test('SL-21: Verify products can be sorted by price (low to high)', async ({page}) => {
  // Select Price (low to high) sort option
  await page.locator(productPage.productSortLocator).selectOption(appSettings.Sort.PriceLowToHigh);

  // Expected Results for sorting
  await sortedProducts(page);
});

test('SL-22: Verify products can be sorted by price (high to low)', async ({page}) => {
  // Select Price (high to low) sort option
  await page.locator(productPage.productSortLocator).selectOption(appSettings.Sort.PriceHighToLow);

  // Expected Results for sorting
  await sortedProducts(page);
});

test('SL-23: Verify user can add a product to the cart', async ({page}) => {
  const product = page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Backpack.Name });

  // Click add to cart button for the product
  await product.locator(productPage.itemBtnLocator).click();

  // Verify the button changes to Remove
  await expect(product.locator(productPage.itemBtnLocator)).toHaveText(productPage.removeBtnText);

  // Verify the cart badge shows 1
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');
});

test('SL-24: Verify user can add multiple products to the cart', async ({page}) => {
  // Click add to cart button for three products
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Backpack.Name }).locator(productPage.itemBtnLocator).click();
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.BikeLight.Name }).locator(productPage.itemBtnLocator).click();
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Onesie.Name }).locator(productPage.itemBtnLocator).click();

  // Verify the cart badge shows 3
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('3');

  // Verify three Remove buttons are displayed
  await expect(page.locator(productPage.removeBtnLocator)).toHaveCount(3);
});

test('SL-25: Verify user can remove a product from the inventory page', async ({page}) => {
  const product = page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Backpack.Name });

  // Add the product to the cart
  await product.locator(productPage.itemBtnLocator).click();
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');

  // Click Remove button for the product
  await product.locator(productPage.itemBtnLocator).click();

  // Verify the button changes back to Add to cart
  await expect(product.locator(productPage.itemBtnLocator)).toHaveText(productPage.addToCartBtnText);

  // Verify the cart badge is hidden
  await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();
});

test('SL-26: Verify user can open the product details page', async ({page}) => {
  // Click on the product name
  await page.locator(productPage.itemNameLocator).filter({ hasText: appSettings.Products.FleeceJacket.Name }).click();

  // Expected Results for product details page
  await productDetails(page, appSettings.Products.FleeceJacket);
});

test('SL-27: Verify user can add a product to the cart from the details page', async ({page}) => {
  // Open the product details page
  await page.locator(productPage.itemNameLocator).filter({ hasText: appSettings.Products.BikeLight.Name }).click();
  await productDetails(page, appSettings.Products.BikeLight);

  // Click add to cart button
  await page.locator(productDetailsPage.addToCartBtnLocator).click();

  // Verify the Remove button is displayed and the cart badge shows 1
  await expect(page.locator(productDetailsPage.removeBtnLocator)).toBeVisible();
  await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');
});

test('SL-28: Verify Back to products button returns to the inventory page', async ({page}) => {
  // Open the product details page
  await page.locator(productPage.itemNameLocator).filter({ hasText: appSettings.Products.Onesie.Name }).click();
  await productDetails(page, appSettings.Products.Onesie);

  // Click Back to products button
  await page.locator(productDetailsPage.backToProductsBtnLocator).click();

  // Verify the user is redirected to the inventory page
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator(productPage.pageTitleLocator)).toHaveText(productPage.pageTitle);
});
