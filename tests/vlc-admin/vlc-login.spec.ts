import { test, expect } from '@playwright/test';

test('VLC login page loads', async ({ page }) => {
  await page.goto('https://vlc.staging.palaceproject.io/admin/login/?next=/admin/');

  await expect(page.getByLabel(/username|email/i)).toBeVisible();
  await expect(page.getByLabel(/password/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /log in|sign in/i })).toBeVisible();
});