import { test, expect } from '@playwright/test';

test('user can register', async ({ page }) => {
  await page.goto('http://localhost:3000/login');
  await page.locator('div').filter({ hasText: /^Username$/ }).getByPlaceholder('enter here..').click();
  await page.locator('div').filter({ hasText: /^Username$/ }).getByPlaceholder('enter here..').fill('user1');
  await page.locator('div').filter({ hasText: /^Name$/ }).getByPlaceholder('enter here..').click();
  await page.locator('div').filter({ hasText: /^Name$/ }).getByPlaceholder('enter here..').fill('password1');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.getByRole('heading', { name: 'Happy Coding!' })).toBeVisible();
});


test.describe('existing user', () => {

  let username = "whostheman?";
  let password = "patric";

  test.beforeAll(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByPlaceholder('enter here..').click();
    await page.locator('div').filter({ hasText: /^Username$/ }).getByPlaceholder('enter here..').fill(username);
    await page.locator('div').filter({ hasText: /^Name$/ }).getByPlaceholder('enter here..').click();
    await page.locator('div').filter({ hasText: /^Name$/ }).getByPlaceholder('enter here..').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    // expect response to be 200
    });

  test('can log in', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.locator('div').filter({ hasText: /^Username$/ }).getByPlaceholder('enter here..').click();
    await page.locator('div').filter({ hasText: /^Username$/ }).getByPlaceholder('enter here..').fill(username);
    await page.locator('div').filter({ hasText: /^Name$/ }).getByPlaceholder('enter here..').click();
    await page.locator('div').filter({ hasText: /^Name$/ }).getByPlaceholder('enter here..').fill(password);
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByRole('heading', { name: 'Happy Coding!' })).toBeVisible();
  });

});
