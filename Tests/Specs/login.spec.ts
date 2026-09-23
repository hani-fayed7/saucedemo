import { test, expect } from '@playwright/test';
import loginPage from '../Pages/loginModule/loginPage';
import productPage from '../Pages/productsModule/productPage';
import appSettings from '../Test Data/appSettings.json';

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
  await expect(page.locator(productPage.shoppingCartLocator)).toBeVisible();
 
  // Verify that the burger menu is visible
  await expect(page.locator(productPage.burgerMenuLocator)).toBeVisible();

  // Verify that the sort dropdown is visible
  await expect(page.locator(productPage.productSortLocator)).toBeVisible();
}

async function invalidLogin(page: any){
  // Expected Results for invalid login
  await expect(page).toHaveURL('https://www.saucedemo.com/');
  await expect(page.locator(loginPage.errorMsgContainerLocator)).toBeVisible();

  const username = await page.locator(loginPage.usernameLocator).inputValue();
  const password = await page.locator(loginPage.passwordLocator).inputValue();

  if (username === appSettings.Login.Username.Empty){
    await expect(page.locator(loginPage.errorMsgLocator)).toHaveText(loginPage.usernameRequiredMsg);
  }
  else if (password === appSettings.Login.Password.Empty){
    await expect(page.locator(loginPage.errorMsgLocator)).toHaveText(loginPage.passwordRequiredMsg);
  }
  else if (username === appSettings.Login.Username.lockedOutUser){
    await expect(page.locator(loginPage.errorMsgLocator)).toHaveText(loginPage.lockedOutMsg);
  }
  else await expect(page.locator(loginPage.errorMsgLocator)).toHaveText(loginPage.invalidCredentialsMsg);
}

test('SL-7: Verify user can login with valid credentials', async ({page}) => {

  // Enter Valid Credentials
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Valid);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);

  // Click login button 
  await page.locator(loginPage.loginBtnLocator).click(); 

  // Expected Results for successful login
  await successfulLogin(page);
});

test('SL-8: Verify that system handles invalid login credentials', async ({page}) => {
  // Enter Invalid Credentials
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Invalid);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Invalid);

  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for invalid login
  await invalidLogin(page);
});

test('SL-9: Verify that system handles empty login credentials', async ({page}) => {
  // Click login button without entering credentials
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for empty login
  await invalidLogin(page);
});

test('SL-10: Verify that system handles invalid username', async ({page}) => {
  // Enter Invalid Username and Valid Password
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Invalid);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);
  
  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for invalid username
  await invalidLogin(page);
});

test('SL-11: Verify that system handles invalid password', async ({page}) => {
  // Enter Valid Username and Invalid Password
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Valid);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Invalid);
  
  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for invalid password
  await invalidLogin(page);
});

test('SL-12: Verify that system handles empty username', async ({page}) => {
  // Enter Username but leave password empty
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);

  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for empty password
  await invalidLogin(page);
});

test('SL-13: Verify that system handles empty password', async ({page}) => {
  // Enter Username but leave password empty
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.Valid);

  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for empty password
  await invalidLogin(page);
});

test('SL-15: Verify that system handles SQL injections', async ({page}) => {
  // Enter SQL Injection in username and password fields
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.sqlInjection);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);

  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for SQL Injection
  await invalidLogin(page);
});

test('SL-16: Verify that system handles script injections', async ({page}) => {
  // Enter Script Injection in username and password fields
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.scriptInjection);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);

  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for Script Injection
  await invalidLogin(page);
});

test('SL-17: Verify locked_out_user cannot login', async ({page}) => {
  // Enter Credentials for locked_out_user
  await page.locator(loginPage.usernameLocator).fill(appSettings.Login.Username.lockedOutUser);
  await page.locator(loginPage.passwordLocator).fill(appSettings.Login.Password.Valid);

  // Click login button
  await page.locator(loginPage.loginBtnLocator).click();

  // Expected Results for locked_out_user
  await invalidLogin(page);
});