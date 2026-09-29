import { test, expect } from '@playwright/test';
import { login } from './utils';

test('User can sign in successfully', async ({ page }) => {
  await login(page);

  await expect(page).toHaveURL(/admin/);
  await expect(page.getByRole('link', { name: 'Change password' })).toBeVisible();
});