import { test, expect } from '@playwright/test';
import { login } from './utils';

test('Library cards page loads', async ({ page }) => {
  await login(page);

  await page.getByRole('link', { name: 'Library cards' }).click();

  await expect(page).toHaveURL(/library/i);
  await expect(page.getByRole('heading', { name: /select library card to change/i })
).toBeVisible();
});