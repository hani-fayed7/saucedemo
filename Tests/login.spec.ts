import { test, expect } from '@playwright/test';

test.beforeAll('Preconditions', async ({ page }) => {
  console.log('Starting Login Tests');
});

test.beforeEach('Preconditions', async ({ page }) => {
  console.log('Navigating To The Website');

   // Navigate to the login page
  await page.goto('https://www.saucedemo.com/');

});

async function successfulLogin(page: any) {
  // Expected Results for successful login

  // Verify that the user is redirected to the inventory page
  await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  await expect(page).toHaveTitle(/Swag Labs/);

  // Verify that the cart icon is visible
  await expect(page.locator(".shopping_cart_link")).toBeVisible();
 
  // Verify that the burger menu is visible
  await expect(page.locator(".bm-burger-button")).toBeVisible();

  // Verify that the sort dropdown is visible
  await expect(page.locator(".product_sort_container")).toBeVisible();
}

test('SL-7: Verify user can login with valid credentials', async ({page}) => {

  // Enter Valid Credentials
  await page.locator("#user-name").fill('standard_user');
  await page.locator("#password").fill('secret_sauce');

  // Click login button 
  await page.locator("#login-button").click(); 

  // Expected Results for successful login
  await successfulLogin(page);
});

test.afterAll('Expected Results', async ({ page }) => {
  console.log('Login Tests Completed');
  await page.close();
});