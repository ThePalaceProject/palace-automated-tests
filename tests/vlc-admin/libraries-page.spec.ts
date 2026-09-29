import { test, expect } from '@playwright/test';
import { login } from './utils';

test('Libraries page loads', async ({ page }) => {
  await login(page);

  await page.getByRole('link', { name: 'Libraries', exact:true }).click();

  await expect(page).toHaveURL(/library/i);
  await expect(page.getByRole('heading', { name: /select library to change/i })
).toBeVisible();
});