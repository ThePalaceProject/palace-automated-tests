import { test, expect } from '@playwright/test';
import { login } from './utils';

test('Admin home loads after login', async ({ page }) => {
  await login(page);

  await expect(page).toHaveURL(/admin/);
  await expect(page.getByRole('heading', { name: /site administration/i })).toBeVisible();
});