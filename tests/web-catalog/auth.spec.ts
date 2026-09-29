import { test, expect } from '@playwright/test';
import { signIn, skipWithoutCatalogCredentials } from './auth-utils';

skipWithoutCatalogCredentials(test);
test.setTimeout(60000);

test('Sign in with valid library card', async ({ page }) => {
  await signIn(page);
});

test('Sign out successfully', async ({ page }) => {
  await signIn(page);

  const accountButton = page.getByRole('button', { name: /^Account$/ });
  await expect(accountButton).toBeVisible();
  await accountButton.click();
  await page.getByRole('menu', { name: /^Account$/ }).getByRole('button', { name: /^Sign Out$/ }).click();
  await page
    .getByRole('alertdialog', { name: /^Sign Out$/ })
    .getByRole('button', { name: /^Sign Out$/ })
    .click();

  await expect(page.getByRole('banner').getByRole('link', { name: /Sign In/i })).toBeVisible();
});
