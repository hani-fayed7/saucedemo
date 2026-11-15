import { test, expect } from '@playwright/test';
import loginPage from '../Pages/loginModule/loginPage';
import productPage from '../Pages/productsModule/productPage';
import cartPage from '../Pages/cartModule/cartPage';
import checkoutInfoPage from '../Pages/checkoutModule/checkoutInfoPage';
import checkoutOverviewPage from '../Pages/checkoutModule/checkoutOverviewPage';
import checkoutCompletePage from '../Pages/checkoutModule/checkoutCompletePage';
import appSettings from '../Test Data/appSettings.json';

// Tests marked with test.fail() verify the correct behaviour for a known SauceDemo bug of that user.
// They are reported as "expected to fail" and will start failing once the bug is fixed.

test.beforeEach('Preconditions', async ({ page }) => {
  // Navigate to the login page
  await page.goto('https://www.saucedemo.com/');
});


async function loginAs(page: any, username: string) {
  // Login with the given username and valid password
  await page.locator(loginPage.usernameLocator).fill(username);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);
  await page.locator(loginPage.loginBtnLocator).click();

  // Verify the user is redirected to the inventory page and the products are displayed (performance_glitch_user needs a longer timeout)
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page.locator(productPage.inventoryItemLocator)).toHaveCount(productPage.productsCount, { timeout: 15000 });
}

async function addProductToCart(page: any, product: any) {
  // Click add to cart button for the product on the inventory page
  await page.locator(productPage.inventoryItemLocator).filter({ hasText: product.Name }).locator(productPage.itemBtnLocator).click();
}

const allUsers = [
  { id: 'SL-49', username: appSettings.Login.Username.Valid, knownBug: '' },
  { id: 'SL-50', username: appSettings.Login.Username.performanceGlitchUser, knownBug: '' },
  { id: 'SL-51', username: appSettings.Login.Username.problemUser, knownBug: 'Last Name field overwrites First Name field' },
  { id: 'SL-52', username: appSettings.Login.Username.errorUser, knownBug: 'Last Name field cannot be filled and Finish button does nothing' },
  { id: 'SL-53', username: appSettings.Login.Username.visualUser, knownBug: '' }
];

for (const user of allUsers) {
  test(`${user.id}: Verify ${user.username} can complete a purchase`, async ({page}) => {
    test.fail(!!user.knownBug, user.knownBug);

    // Login
    await loginAs(page, user.username);

    // Add a product to the cart and open the cart
    await addProductToCart(page, appSettings.Products.Backpack);
    await page.locator(productPage.shoppingCartLocator).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/cart.html');
    await expect(page.locator(cartPage.cartItemLocator).locator(cartPage.itemNameLocator)).toHaveText(appSettings.Products.Backpack.Name);

    // Click Checkout button and enter valid checkout information
    await page.locator(cartPage.checkoutBtnLocator).click();
    await page.locator(checkoutInfoPage.firstNameLocator).fill(appSettings.Checkout.FirstName.Valid);
    await page.locator(checkoutInfoPage.lastNameLocator).fill(appSettings.Checkout.LastName.Valid);
    await page.locator(checkoutInfoPage.postalCodeLocator).fill(appSettings.Checkout.PostalCode.Valid);
    await page.locator(checkoutInfoPage.continueBtnLocator).click();
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-step-two.html');

    // Click Finish button
    await page.locator(checkoutOverviewPage.finishBtnLocator).click();

    // Verify the order confirmation is displayed
    await expect(page).toHaveURL('https://www.saucedemo.com/checkout-complete.html');
    await expect(page.locator(checkoutCompletePage.completeHeaderLocator)).toHaveText(checkoutCompletePage.completeHeaderMsg);
  });
}

const sortingUsers = [
  { id: 'SL-54', username: appSettings.Login.Username.problemUser, knownBug: 'Sorting does nothing' },
  { id: 'SL-55', username: appSettings.Login.Username.errorUser, knownBug: 'Sorting shows a "Sorting is broken!" alert' }
];

for (const user of sortingUsers) {
  test(`${user.id}: Verify ${user.username} can sort products`, async ({page}) => {
    test.fail(!!user.knownBug, user.knownBug);

    // Login
    await loginAs(page, user.username);

    // Select Name (Z to A) sort option
    await page.locator(productPage.productSortLocator).selectOption(appSettings.Sort.NameZtoA);

    // Verify products are sorted by name (Z to A)
    const names = await page.locator(productPage.itemNameLocator).allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });
}

const addToCartUsers = [
  { id: 'SL-56', username: appSettings.Login.Username.problemUser, knownBug: 'Some products cannot be added to the cart' },
  { id: 'SL-57', username: appSettings.Login.Username.errorUser, knownBug: 'Some products cannot be added to the cart' }
];

for (const user of addToCartUsers) {
  test(`${user.id}: Verify ${user.username} can add all products to the cart`, async ({page}) => {
    test.fail(!!user.knownBug, user.knownBug);

    // Login
    await loginAs(page, user.username);

    // Click add to cart button for all products
    for (const product of Object.values(appSettings.Products)) {
      await addProductToCart(page, product);
    }

    // Verify all buttons change to Remove and the cart badge shows 6
    await expect(page.locator(productPage.removeBtnLocator)).toHaveCount(productPage.productsCount);
    await expect(page.locator(productPage.cartBadgeLocator)).toHaveText(String(productPage.productsCount));
  });
}

const removeFromCartUsers = [
  { id: 'SL-58', username: appSettings.Login.Username.problemUser, knownBug: 'Some products cannot be removed from the inventory page' },
  { id: 'SL-59', username: appSettings.Login.Username.errorUser, knownBug: 'Some products cannot be removed from the inventory page' }
];

for (const user of removeFromCartUsers) {
  test(`${user.id}: Verify ${user.username} can remove products from the inventory page`, async ({page}) => {
    test.fail(!!user.knownBug, user.knownBug);

    // Login
    await loginAs(page, user.username);

    // Add a product to the cart
    await addProductToCart(page, appSettings.Products.Backpack);
    await expect(page.locator(productPage.cartBadgeLocator)).toHaveText('1');

    // Click Remove button for the product
    await page.locator(productPage.inventoryItemLocator).filter({ hasText: appSettings.Products.Backpack.Name }).locator(productPage.removeBtnLocator).click();

    // Verify the cart badge is hidden
    await expect(page.locator(productPage.cartBadgeLocator)).toBeHidden();
  });
}

const productImagesUsers = [
  { id: 'SL-60', username: appSettings.Login.Username.problemUser, knownBug: 'All products show the same image' },
  { id: 'SL-61', username: appSettings.Login.Username.visualUser, knownBug: 'Sauce Labs Backpack shows the wrong image' }
];

for (const user of productImagesUsers) {
  test(`${user.id}: Verify ${user.username} sees the correct product images`, async ({page}) => {
    test.fail(!!user.knownBug, user.knownBug);

    // Login
    await loginAs(page, user.username);

    // Verify each product shows its own image and no "not found" image is displayed
    const images = await page.locator(productPage.itemImgLocator).evaluateAll((imgs: any[]) => imgs.map(img => img.getAttribute('src')));
    expect(new Set(images).size).toBe(productPage.productsCount);
    for (const image of images) {
      expect(image).not.toContain('sl-404');
    }
  });
}

const checkoutInfoUsers = [
  { id: 'SL-62', username: appSettings.Login.Username.problemUser, knownBug: 'Last Name field overwrites First Name field' },
  { id: 'SL-63', username: appSettings.Login.Username.errorUser, knownBug: 'Last Name field cannot be filled' }
];

for (const user of checkoutInfoUsers) {
  test(`${user.id}: Verify ${user.username} can fill the checkout information`, async ({page}) => {
    test.fail(!!user.knownBug, user.knownBug);

    // Login, add a product and go to checkout
    await loginAs(page, user.username);
    await addProductToCart(page, appSettings.Products.Backpack);
    await page.locator(productPage.shoppingCartLocator).click();
    await page.locator(cartPage.checkoutBtnLocator).click();

    // Enter valid checkout information
    await page.locator(checkoutInfoPage.firstNameLocator).fill(appSettings.Checkout.FirstName.Valid);
    await page.locator(checkoutInfoPage.lastNameLocator).fill(appSettings.Checkout.LastName.Valid);
    await page.locator(checkoutInfoPage.postalCodeLocator).fill(appSettings.Checkout.PostalCode.Valid);

    // Verify all fields keep the entered values
    await expect(page.locator(checkoutInfoPage.firstNameLocator)).toHaveValue(appSettings.Checkout.FirstName.Valid);
    await expect(page.locator(checkoutInfoPage.lastNameLocator)).toHaveValue(appSettings.Checkout.LastName.Valid);
    await expect(page.locator(checkoutInfoPage.postalCodeLocator)).toHaveValue(appSettings.Checkout.PostalCode.Valid);
  });
}

test('SL-64: Verify visual_user sees the correct product prices', async ({page}) => {
  test.fail(true, 'Product prices are random');

  // Login
  await loginAs(page, appSettings.Login.Username.visualUser);

  // Verify each product shows its correct price
  for (const product of Object.values(appSettings.Products)) {
    await expect(page.locator(productPage.inventoryItemLocator).filter({ hasText: product.Name }).locator(productPage.itemPriceLocator)).toHaveText(product.Price);
  }
});

test('SL-65: Verify visual_user sees the correct page layout', async ({page}) => {
  test.fail(true, 'Cart icon and an add to cart button are misplaced');

  // Login
  await loginAs(page, appSettings.Login.Username.visualUser);

  // Verify the cart icon and add to cart buttons are not misplaced
  await expect(page.locator(productPage.visualFailureLocator)).toHaveCount(0);
});

test('SL-66: Verify performance_glitch_user logs in within an acceptable time', async ({page}) => {
  test.fail(true, 'Login takes around 5 seconds');

  // Enter Credentials for performance_glitch_user
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.performanceGlitchUser);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);

  // Click login button and measure the time until the products are displayed
  const startTime = Date.now();
  await page.locator(loginPage.loginBtnLocator).click();
  await expect(page.locator(productPage.inventoryItemLocator)).toHaveCount(productPage.productsCount, { timeout: 15000 });
  const loginTime = Date.now() - startTime;

  // Verify login takes less than 2 seconds
  expect(loginTime).toBeLessThan(2000);
});
