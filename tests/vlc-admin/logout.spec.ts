import { test, expect } from '@playwright/test';
import { login } from './utils';

test('User can log out successfully', async ({ page }) => {
  await login(page);

  await page.getByRole('button', { name: 'Log out' }).click();

  await expect(page).toHaveURL(/logout/);
  await expect(page.getByRole('heading', { name: /logged out/i })).toBeVisible();
});