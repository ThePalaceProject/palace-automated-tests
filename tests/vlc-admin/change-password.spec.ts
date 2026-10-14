
import { test, expect } from '@playwright/test';
import { login } from './utils';

test('Change password page loads', async ({ page }) => {
  await login(page);

  await page.getByRole('link', {
    name: 'Change password'
  }).click();

  await expect(page).toHaveURL(/password_change/i);

  await expect(
    page.getByRole('heading', { name: /password change/i })
  ).toBeVisible();
});
