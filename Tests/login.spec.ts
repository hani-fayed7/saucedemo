import { test, expect } from '@playwright/test';

test.beforeEach('Preconditions', async ({ page }) => {
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

async function invalidLogin(page: any){
  // Expected Results for invalid login
  await expect(page.locator(".error-message-container")).toBeVisible();
  await expect(page.locator("[data-test='error']")).toHaveText('Epic sadface: Username and password do not match any user in this service');
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

test('SL-8: Verify that system handles invalid login credentials', async ({page}) => {
  // Enter Invalid Credentials
  await page.locator("#user-name").fill('user_hani');
  await page.locator("#password").fill('password@123');

  // Click login button
  await page.locator("#login-button").click();

  // Expected Results for invalid login
  await invalidLogin(page);
});

test('SL-9: Verify that system handles empty login credentials', async ({page}) => {
  // Click login button without entering credentials
  await page.locator("#login-button").click();

  // Expected Results for empty login
  await expect(page.locator(".error-message-container")).toBeVisible();
  await expect(page.locator("[data-test='error']")).toHaveText('Epic sadface: Username is required');
});

test('SL-10: Verify that system handles invalid username', async ({page}) => {
  // Enter Invalid Username and Valid Password
  await page.locator("#user-name").fill('user_hani');
  await page.locator("#password").fill('secret_sauce');
  
  // Click login button
  await page.locator("#login-button").click();

  // Expected Results for invalid username
  await invalidLogin(page);
});

test('SL-11: Verify that system handles invalid password', async ({page}) => {
  // Enter Valid Username and Invalid Password
  await page.locator("#user-name").fill('standard_user');
  await page.locator("#password").fill('password@123');
  
  // Click login button
  await page.locator("#login-button").click();

  // Expected Results for invalid password
  await invalidLogin(page);
});

test('SL-12: Verify that system handles empty username', async ({page}) => {
  // Enter Username but leave password empty
  await page.locator("#password").fill('secret_sauce');

  // Click login button
  await page.locator("#login-button").click();

  // Expected Results for empty password
  await expect(page.locator(".error-message-container")).toBeVisible();
  await expect(page.locator("[data-test='error']")).toHaveText('Epic sadface: Username is required');
});

test('SL-13: Verify that system handles empty password', async ({page}) => {
  // Enter Username but leave password empty
  await page.locator("#user-name").fill('standard_user');

  // Click login button
  await page.locator("#login-button").click();

  // Expected Results for empty password
  await expect(page.locator(".error-message-container")).toBeVisible();
  await expect(page.locator("[data-test='error']")).toHaveText('Epic sadface: Password is required');
});

test('SL-15: Verify that system handles SQL injections', async ({page}) => {
  // Enter SQL Injection in username and password fields
  await page.locator("#user-name").fill('OR 1=1');
  await page.locator("#password").fill('secret_sauce');

  // Click login button
  await page.locator("#login-button").click();

  // Expected Results for SQL Injection
  await invalidLogin(page);
});

test('SL-16: Verify that system handles script injections', async ({page}) => {
  // Enter Script Injection in username and password fields
  await page.locator("#user-name").fill('<script>alert(1)</script>');
  await page.locator("#password").fill('secret_sauce');

  // Click login button
  await page.locator("#login-button").click();

  // Expected Results for Script Injection
  await invalidLogin(page);
});